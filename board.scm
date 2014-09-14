
;;-----------------------------------------------------------------------------;;
;;                                                                             ;;
;; -- Board Utility Functions --                                               ;;
;;                                                                             ;;
;; This file contains the definitions of functions that manipulate the game    ;;
;; board.                                                                      ;;
;;                                                                             ;;
;;-----------------------------------------------------------------------------;;


;;- Print the current game board. Usefull while no GUI is present
(define (print-board board)
   (format #t "\nBoard: ~a\n\n" board))


;;- Alternate the current player (this is what make game turns)
(define (switch-player current-player player-1 player-2)
  (cond ((eq? current-player player-1) player-2)
        (else player-1)))


;;- Modify the contents of a game board cell
  (define (set-cell-value! value cell board)
    (let ((ring (car cell))
          (index (cadr cell)))
      (list-set! (list-ref board ring) index value)))


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