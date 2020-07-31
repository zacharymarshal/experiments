# experiments/go-remote-clipboard aka "bubba"

I wanted a way to copy & paste from my mac to my remote dev server and vice
versa.

When you have something big you want to copy to or from your remote dev server
it becomes annoying to have to scp a file and read that file in vim or
whatever. I just wanted a way that if I copied something on my dev server it
would send it to my macs clipboard.

## Usage

```
# on your pc
bubba

# remote forward unix socket
ssh -R /home/zacharyrankin/.bubba.sock:/Users/zacharyrankin/.bubba.sock zuuu.dev

# on the server
echo "Wooo" | bubba -copy
bubba -paste > some_file.txt
```

## FAQ

**Setup your .ssh/config to always forward bubba socket

```
RemoteForward /home/zacharyrankin/.bubba.sock:/Users/zacharyrankin/.bubba.sock
```

**Getting "connection refused" error after logging into server 2 times**

Make sure to set `StreamLocalBindUnlink yes` in your server sshd_config. Or
you need to remove the `.bubba.sock` file manually on your server.

**How to make this work in VIM**

```
nnoremap <leader>y :call system('bubba -socket-address ~/.bubba.sock -copy', @0)<CR>
nnoremap <leader>P :call setreg(0, system('bubba -socket-address ~/.bubba.sock -paste'))<CR>
```
