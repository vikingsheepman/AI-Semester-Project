#!/usr/bin/guile -s
!#

(use-modules (ice-9 format)
             (ice-9 readline)
             (ice-9 regex)
             (srfi srfi-1))


;;-----------------------------------------------------------------------------;;
;;                                                                             ;;
;;    -- Polar Tic-Tac-Toe Game Logic / Driver --                              ;;
;;                                                                             ;;
;;                                                                             ;;
;;    -- Usage:                                                                ;;
;;         Assuming that the file "./game.scm" is an executable, issue the     ;;
;;         command "./game.scm" to start playing the PT3 game.                 ;;
;;                                                                             ;;
;;    -- Game Definitions:                                                     ;;
;;         When the game starts you are asked to input your play in the form   ;;
;;         <ring>-<index>, where ring ranges from values 0-3 and index ranges  ;;
;;         from values 0-7. The ring number corresponds to which ring you want ;;
;;         to place your point in, starting from the innermost ring. The index ;;
;;         values are the locations along a given ring, starting from 0 at the ;;
;;         12:00 position and increasing in the clockwise direction.           ;;
;;                                                                             ;;
;;-----------------------------------------------------------------------------;;



;;-----------------------------------------------------------------------------;;
;;                                                                             ;;
;; -- Utility Functions --                                                     ;;
;;                                                                             ;;
;;-----------------------------------------------------------------------------;;

;;- Generate a list from min to length max with step size of step.
;;  ex: (range 0 3 1) => (0 1 2)
(define (range min max step)
  (cond ((>= min max) '())
        (else (cons min (range (+ min step) max step)))))

;;- Create and fill a list given a length and fill value.
;;  ex: (fill-list 'a 3) => (a a a)
(define (fill-list value length)
  (cond ((<= length 0) '())
        (else (cons value (fill-list value (- length 1))))))

;;- Modify an element of a list (list) at a given index (k) setting
;;  to the value (val).
(define (list-set! list k val)
  (if (zero? k)
      (set-car! list val)
      (list-set! (cdr list) (- k 1) val)))

;;- Flatten a nested list into a single level list
(define (flatten-list lst)
  (cond ((null? lst) '())
        ((not (pair? lst)) (list lst))
        (else (append (flatten-list (car lst))
                      (flatten-list (cdr lst))))))



;;-----------------------------------------------------------------------------;;
;;                                                                             ;;
;; -- Game Functions --                                                        ;;
;;                                                                             ;;
;;-----------------------------------------------------------------------------;;

;;- Create initial empty game board
(define (make-board)
  (map (lambda (x) (fill-list 'e 8)) (range 0 4 1)))

;;- Return the contents of a cell
(define (get-cell-value cell board)
  (let ((ring (car cell))
        (index (cadr cell)))
    (list-ref (list-ref board ring) index)))

;;- Modify the contents of a cell
(define (set-cell-value! value cell board)
  (let ((ring (car cell))
        (index (cadr cell)))
    (list-set! (list-ref board ring) index value)))

;;- Allow a player to make a move on the board
(define (move! player cell board)
  (let ((ring (car cell))
        (index (cadr cell)))
    (cond ((not (and (>= ring 0) (< ring 4))) #f)
          ((not (and (>= index 0) (< index 8))) #f)
          (else (let ((contents (get-cell-value cell board)))
                  (cond ((not (eq? contents 'e)) #f)
                        (else (set-cell-value! player cell board) #t)))))))

;;- Check board to see if a player is in a winning state. Returns
;;  a boolean value. There are 4 subconditions that can be met to
;;  put the board in a win state:
;;      1) 4 consecutive pieces in a given ring
;;      2) 4 consecutive pieces in a given column
;;      3) 4 consecutive pieces in a clock-wise spiral
;;      4) 4 consecutive pieces in a counter-clock-wise spiral
(define (win-condition player board)
 
  ;; Check board for 4 in a ring win condition
  (define (check-rings? bitmaps)
    (cond ((eq? bitmaps '()) #f)
          ((string-match "[1][1][1][1]" (string-append (car bitmaps)
                                                       (car bitmaps))) #t)
          (else (check-rings? (cdr bitmaps)))))
  
  ;; Check board for 4 in a column win condition
  (define (check-columns? bitmaps)
    (let ((reduced-bitmap (fold logand
                                #xff
                                (map (lambda (x) (string->number x 2))
                                     bitmaps))))
      (cond ((not (= reduced-bitmap 0)) #t)
            (else #f))))
 
  ;; Check board for 4 in clockwise spiral win condition
  (define (check-right-spirals? bitmaps)
    (let* ((offset -1)
           (reduced-bitmap (fold logand
                                 #xff
                                 (map (lambda (x)
                                        (begin
                                          (set! offset (+ offset 1))
                                          (modulo (* (string->number x 2)
                                                     (expt 2 offset)) #xff)))
                                      bitmaps))))
      (cond ((not (= reduced-bitmap 0)) #t)
            (else #f))))
  
  ;; Check board for 4 in couter clockwise spiral win condition
  (define (check-left-spirals? bitmaps)
    (let* ((offset 0)
           (reduced-bitmap (fold logand
                                 #xff
                                 (map (lambda (x)
                                        (begin
                                          (set! offset (+ offset 1))
                                          (modulo (* (string->number
                                                      (string-reverse x) 2)
                                                     (expt 2 offset)) #xff)))
                                      bitmaps))))
      (cond ((not (= reduced-bitmap 0)) #t)
            (else #f))))
  
  ;; Create list that contains the string bitmaps for each ring.
  ;; If the player has a piece at the location a 1 is placed, and
  ;; if not a 0 is placed. This will make it easier to determine
  ;; if the board is in a win state.
  (let ((bitmap-list '()))
    (map (lambda (lst)
           (let* ((bitmap ""))
             (map (lambda (x)
                    (cond ((eq? x player) (set! bitmap (string-append bitmap "1")))
                          (else (set! bitmap (string-append bitmap "0")))))
                  lst)
             (set! bitmap-list (append bitmap-list
                                       (list bitmap)))))
         board)
    (cond ((check-rings? bitmap-list) #t)
          ((check-columns? bitmap-list) #t)
          ((check-right-spirals? bitmap-list) #t)
          ((check-left-spirals? bitmap-list) #t)
          (else #f))))

;;- Print the current game board. Usefull while no GUI is present
(define (print-board board)
   (format #t "\nBoard: ~a\n\n" board))

;; Let a human player play in a CLI interface
(define (human-play player board)
  (let ((valid-move? #f))
    (do ()
        (valid-move?)
      (let* ((player-move (readline "\nEnter move as <ring>-<index>: "))
             (cell (map string->number (string-split player-move #\-))))
        (set! valid-move? (move! player cell board))
        (cond ((not valid-move?) (format #t "Not a valid move. Try again.\n"))
              (else '()))))))

;;- Alternate the current player (this is what make game turns)
(define (switch-player current-player player-1 player-2)
  (cond ((eq? current-player player-1) player-2)
        (else player-1)))




;;-----------------------------------------------------------------------------;;
;;                                                                             ;;
;; -- Main Driver Function / Program Entry --                                  ;;
;;                                                                             ;;
;;-----------------------------------------------------------------------------;;

(define (main)
  (let* ((board (make-board))
         (player-1 'x)
         (player-2 'o)
         (current-player player-2))
   
    ;;--------- START GAME ----------;;

    (do ()
        ((win-condition current-player board))
      (begin
        (set! current-player (switch-player current-player player-1 player-2))
        (human-play current-player board)
        (print-board board)
        ))

    (format #t "\nPlayer ~a wins!\n\n" current-player)
    
    ;;--------- END GAME ------------;;

    
    (format #t "\n  ---  EOF  ---\n\n")
    ))(main)
