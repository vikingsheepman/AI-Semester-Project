
;;-----------------------------------------------------------------------------;;
;;                                                                             ;;
;;    -- Human Player Class --                                                 ;;
;;                                                                             ;;
;;    This class contains the definition of how a human player makes board     ;;
;;    moves. It is an extension of the <player> class. The moves are created   ;;
;;    by reading user input until a valid move is made.                        ;;
;;                                                                             ;;
;;-----------------------------------------------------------------------------;;

(load "network.scm")

;; Class definition
(define-class <human> (<player>) symbol)

;; Human player move definition
(define-method (move (p <human>) board)
  (let ((valid-move? #f)
        (player (slot-ref p 'symbol))
        (move-made '()))
    (do ()
        (valid-move?)
      (let* ((player-move (get-socket-data 6666))
             (cell (map string->number (string-split player-move #\-))))
        (set! valid-move? (free-cell? p cell board))
        (cond (valid-move? (set! move-made cell))
              (else '()))))
    move-made))
