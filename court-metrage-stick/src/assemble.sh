#!/bin/bash
# concatène les blocs vidéo, ajoute un grain léger et la bande-son
cd "$(dirname "$0")/../build" && ffmpeg -y -loglevel error -f concat -safe 0 -i list.txt -i mix.wav -vf "noise=alls=3:allf=t,format=yuv420p" -c:v libx264 -preset medium -crf 23 -maxrate 9M -bufsize 18M -r 30 -profile:v high -movflags +faststart -c:a aac -b:a 192k -ar 44100 -shortest ../out/il_a_recu_un_message_de_lui_meme.mp4 && echo "Film : out/il_a_recu_un_message_de_lui_meme.mp4"
