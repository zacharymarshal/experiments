use dirs::home_dir;
use exitfailure::ExitFailure;
use failure::{bail, Error, ResultExt};
use std::fs::remove_file;
use std::io::{copy as io_copy, stdin, stdout, Read, Write};
use std::os::unix::net::{UnixListener, UnixStream};
use std::path::PathBuf;
use structopt::StructOpt;

#[derive(StructOpt)]
#[structopt(about)]
struct Clipboard {
    #[structopt(
        short = "s",
        long,
        parse(from_os_str),
        env = "CLIPBOARD_UNIX_SOCKET_PATH"
    )]
    unix_socket_path: Option<PathBuf>,
    #[structopt(subcommand)]
    cmd: Command,
}

#[derive(StructOpt)]
enum Command {
    /// Copy something to the Clipboard
    Copy,
    /// Output whatever is on the clipboard
    Paste,
    /// Start the Clipboard
    Start,
}

fn main() -> Result<(), ExitFailure> {
    let args = Clipboard::from_args();
    let unix_socket_path = match args.unix_socket_path {
        Some(path) => path,
        None => get_default_unix_socket_path()?,
    };

    match args.cmd {
        Command::Copy => copy(unix_socket_path)?,
        Command::Paste => paste(unix_socket_path)?,
        Command::Start => start(unix_socket_path)?,
    }

    Ok(())
}

fn start(unix_socket_path: PathBuf) -> Result<(), Error> {
    if unix_socket_path.exists() {
        if UnixStream::connect(&unix_socket_path).is_ok() {
            bail!("unix_socket_path is already alive {:?}", unix_socket_path)
        }

        println!(
            "Dead UNIX socket found at {:?} (removing)",
            unix_socket_path
        );
        remove_file(&unix_socket_path)?;
    }

    println!("Listening on {:?}", unix_socket_path);
    let listener = UnixListener::bind(unix_socket_path)?;

    let mut item = String::new();

    for stream in listener.incoming() {
        match stream {
            Ok(mut stream) => {
                let mut msg_type = [0; 1];
                stream.read_exact(&mut msg_type)?;
                if &msg_type == b"C" {
                    item = String::new();
                    stream.read_to_string(&mut item)?;
                } else if &msg_type == b"P" {
                    stream.write_all(&item.as_bytes())?;
                }
            }
            Err(err) => {
                println!("Error: {}", err);
                break;
            }
        }
    }

    Ok(())
}

fn copy(unix_socket_path: PathBuf) -> Result<(), Error> {
    let mut stdin = stdin();
    let mut unix_stream = UnixStream::connect(&unix_socket_path)
        .with_context(|_| format!("Could not connect to {:?}", &unix_socket_path))?;
    unix_stream.write_all(b"C")?;
    io_copy(&mut stdin, &mut unix_stream)?;

    Ok(())
}

fn paste(unix_socket_path: PathBuf) -> Result<(), Error> {
    let mut unix_stream = UnixStream::connect(&unix_socket_path)
        .with_context(|_| format!("Could not connect to {:?}", &unix_socket_path))?;
    unix_stream.write_all(b"P")?;

    let mut stdout = stdout();
    io_copy(&mut unix_stream, &mut stdout)?;

    Ok(())
}

fn get_default_unix_socket_path() -> Result<PathBuf, Error> {
    match home_dir() {
        Some(dir) => Ok(dir.join(".clipboard.sock")),
        None => bail!("Could not determine home directory"),
    }
}
