build:
	docker-compose exec -T --env GOOS=darwin --env GOARCH=amd64 golang go build -o bubba_darwin bubba.go
	docker-compose exec -T --env GOOS=linux --env GOARCH=amd64 golang go build -o bubba_linux bubba.go
