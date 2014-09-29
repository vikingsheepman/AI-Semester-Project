
;;-----------------------------------------------------------------------------;;
;;                                                                             ;;
;; -- Player Parent Class --                                                   ;;
;;                                                                             ;;
;; Class contains methods that are used by all player child classes.           ;;
;;                                                                             ;;
;;-----------------------------------------------------------------------------;;

;; Class definition
(define-class <player> () symbol)

;; Return the players symbol (x or o)
(define-method (get-symbol (p <player>))
  (slot-ref p 'symbol))

;; Perform a check to see if the game board cell is free
(define-method (free-cell? (p <player>) cell board)
  (define (get-cell-value cell board)
    (let ((ring (car cell))
          (index (cadr cell)))
      (list-ref (list-ref board ring) index)))

  (let ((ring (car cell))
        (index (cadr cell)))
    (cond ((not (and (>= ring 0) (< ring 4))) #f)
          ((not (and (>= index 0) (< index 12))) #f)
          (else (let ((contents (get-cell-value cell board)))
                  (cond ((not (eq? contents 'e)) #f)
                        (else #t)))))))
