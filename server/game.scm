#!/usr/bin/guile -s
!#

(use-modules (ice-9 format)
             (ice-9 readline)
             (ice-9 regex)
             (srfi srfi-1)
             (oop goops))

(load "utils.scm")
(load "board.scm")
(load "network.scm")
(load "player-class.scm")
(load "human-player.scm")


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
;; -- Main Driver Function / Program Entry --                                  ;;
;;                                                                             ;;
;;-----------------------------------------------------------------------------;;
(define port 6666)

(define (main)  
  (let* (;;-- list of possible player types
         (ptypes '(("human" . (make <human>))))
         ;;-- player initialization
         (player-1 (eval (assoc-ref ptypes (get-socket-data port)) (current-module)))
         (player-2 (eval (assoc-ref ptypes (get-socket-data port)) (current-module)))
         ;;-- board initialization
         (board (map (lambda (x) (fill-list 'e 12)) (range 0 4 1)))
         (current-player player-2))

    ;; setup player symbols (move to initialization later)
    (slot-set! player-1 'symbol 'x)
    (slot-set! player-2 'symbol 'o)
    
    ;;--------- START GAME ----------;;
    (do ()
        ((win-condition (get-symbol current-player) board))
      (begin
        (set! current-player (switch-player current-player player-1 player-2))
        (let ((cell (move current-player board)))
          (set-cell-value! (get-symbol current-player) cell board)
          (print-board board)
          (send-socket-data 6667 "#f"))))

    ;;-- send winner data
    (send-socket-data port (get-symbol current-player))
    
    (format #t "\n  ---  END GAME  ---\n\n")
    ))(main)
