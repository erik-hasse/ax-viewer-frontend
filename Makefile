all: clean local

local: clean
	docker build -t frontendserver .
	docker run --name frontend -p 80:80 -v /home/erik/projects/ax-react/static:/app/static -d frontendserver

clean:
	docker ps | grep frontend | awk '{print $$1}' | xargs docker stop || true
	docker ps -a | grep frontend | awk '{print $$1}' | xargs docker rm || true

.PHONY:
