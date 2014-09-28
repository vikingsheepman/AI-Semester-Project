
(use-modules (ice-9 rdelim))


(define (get-socket-data)
  (let ((s (socket PF_INET SOCK_STREAM 0))
        (data '()))
    
    (setsockopt s SOL_SOCKET SO_REUSEADDR 1)
    (bind s AF_INET (inet-pton AF_INET "127.0.0.1") 6666)
    (listen s 1)

    (let* ((client-connection (accept s))
           (client-details (cdr client-connection))
           (client (car client-connection)))
      (set! data (read client))
      (close client))
    data))

(define (send-socket-data data)
  (let ((s (socket PF_INET SOCK_STREAM 0)))
    (connect s AF_INET (inet-aton "127.0.0.1") 6666)
    (write data s)))


