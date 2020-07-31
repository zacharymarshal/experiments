package main

import (
	"bufio"
	"flag"
	"io"
	"log"
	"net"
	"os"
	"os/exec"
	"os/signal"
	"syscall"
)

var showHelp bool
var copy bool
var paste bool
var socketLocation string
var copyCommand string
var pasteCommand string

func init() {
	const (
		helpUsage           = "show usage information"
		copyUsage           = "copy from stdin to pc clipboard"
		pasteUsage          = "paste from pc clipboard to stdout"
		socketLocationUsage = "unix socket location"
		copyCommandUsage    = "the copy command to call on the pc"
		pasteCommandUsage   = "the PC command to get the most recent element from the clipboard"
	)
	flag.BoolVar(&showHelp, "h", false, helpUsage)
	flag.BoolVar(&showHelp, "help", false, helpUsage)
	flag.BoolVar(&copy, "copy", false, copyUsage)
	flag.BoolVar(&paste, "paste", false, pasteUsage)

	flag.StringVar(&socketLocation, "socket-address", ".bubba.sock", socketLocationUsage)
	flag.StringVar(&copyCommand, "copy-command", "pbcopy", copyCommandUsage)
	flag.StringVar(&pasteCommand, "paste-command", "pbpaste", pasteCommandUsage)
}

func main() {
	flag.Parse()

	if showHelp {
		flag.Usage()
		os.Exit(0)
	}

	if copy {
		copyFromStdin(socketLocation)
		os.Exit(0)
	}

	if paste {
		pasteToStdout(socketLocation)
		os.Exit(0)
	}

	listen(socketLocation)
}

func listen(socketLocation string) {
	if _, err := os.Stat(socketLocation); !os.IsNotExist(err) {
		if _, err = net.Dial("unix", socketLocation); err == nil {
			log.Fatal("Socket is already live at: " + socketLocation)
		}

		log.Print("Dead socket found at: " + socketLocation + " (removing)")
		if err = os.Remove(socketLocation); err != nil {
			log.Fatal(err)
		}
	}

	log.Print("Listening on " + socketLocation)
	listener, err := net.Listen("unix", socketLocation)
	if err != nil {
		log.Fatal("Listen error: ", err)
	}

	defer listener.Close()

	go func(listener net.Listener) {
		for {
			conn, err := listener.Accept()
			if err != nil {
				return
			}

			go handleConnection(conn)
		}
	}(listener)

	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, os.Kill, syscall.SIGTERM)
	sig := <-c
	log.Print("Got signal ", sig)
}

func handleConnection(conn net.Conn) {
	defer log.Print("Connection closed")
	defer conn.Close()

	r := bufio.NewReader(conn)

	msgType, err := r.ReadByte()
	if err != nil {
		log.Print("[ERROR] getting message type byte")
		return
	}

	if msgType == 'C' {
		log.Print("Copying...")
		copyToPC(r, copyCommand)
	} else if msgType == 'P' {
		log.Print("Pasting...")
		pasteFromPC(conn, pasteCommand)
	}
}

func copyToPC(r *bufio.Reader, copyCommand string) {
	cmd := exec.Command(copyCommand)
	stdin, err := cmd.StdinPipe()
	if err != nil {
		log.Printf("[ERROR] pipe init: %v\n", err)
		return
	}

	if err = cmd.Start(); err != nil {
		log.Printf("[ERROR] process start: %v\n", err)
		return
	}

	if copied, err := r.WriteTo(stdin); err != nil {
		log.Printf("[ERROR] pipe copy: %v\n", err)
	} else {
		log.Print("Copied ", copied, " bytes")
	}
	stdin.Close()

	if err = cmd.Wait(); err != nil {
		log.Printf("[ERROR] wait: %v\n", err)
	}
}

func pasteFromPC(w io.Writer, pasteCommand string) {
	cmd := exec.Command(pasteCommand)
	stdout, err := cmd.StdoutPipe()
	if err != nil {
		log.Printf("[ERROR] pipe init: %v\n", err)
		return
	}

	if err = cmd.Start(); err != nil {
		log.Printf("[ERROR] process start: %v\n", err)
		return
	}

	if copied, err := io.Copy(w, stdout); err != nil {
		log.Printf("[ERROR] pipe copy: %v\n", err)
	} else {
		log.Print("Copied ", copied, " bytes")
	}
	stdout.Close()

	if err = cmd.Wait(); err != nil {
		log.Printf("[ERROR] wait: %v\n", err)
	}
}

func copyFromStdin(socketLocation string) {
	conn, err := net.Dial("unix", socketLocation)
	if err != nil {
		log.Fatal(err)
	}

	n, err := conn.Write([]byte("C"))
	if err != nil {
		log.Printf("[ERROR] writing to conn: %v\n", err, n)
		return
	}

	if _, err := io.Copy(conn, os.Stdin); err != nil {
		log.Printf("[ERROR] pipe copy: %v\n", err)
	}
}

func pasteToStdout(socketLocation string) {
	conn, err := net.Dial("unix", socketLocation)
	if err != nil {
		log.Fatal(err)
	}

	n, err := conn.Write([]byte("P"))
	if err != nil {
		log.Printf("[ERROR] writing to conn: %v\n", err, n)
		return
	}

	if _, err := io.Copy(os.Stdout, conn); err != nil {
		log.Printf("[ERROR] pipe copy: %v\n", err)
	}
}
