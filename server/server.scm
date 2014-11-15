;; CHICKEN egg tcp-server
(require-extension tcp-server posix)

;; initialize tcp server
((make-tcp-server
	;; listening on port 6666 on 127.0.0.1
	(tcp-listen 6666)
	(lambda ()
		write-line ("test"))) 
#t)