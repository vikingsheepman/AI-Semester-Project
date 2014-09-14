
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