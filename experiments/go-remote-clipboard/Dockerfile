FROM golang:latest

WORKDIR /app

COPY ./ /app

RUN go get github.com/githubnemo/CompileDaemon

ENTRYPOINT CompileDaemon -exclude-dir=.git \
  --build="go build bubba.go" \
  --command="./bubba -copy-command ./pbcopy -paste-command ./pbpaste"
