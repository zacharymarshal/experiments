# experiments/react-turbolinks

I want to experiment using React, Turbolinks and Web Components. The idea is to
register a HTML element and when it gets added/removed from the DOM we will
initialize/destroy our react objects.

Maybe something like

```
<react controller="Something">
```

## Running

`docker-compose up` attaches to the [buoy](https://github.com/lightster/buoy) network as
`xp-react-turbolinks`.
