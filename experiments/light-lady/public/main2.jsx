// - Enter should submit form
// - Form data should be stored in query string
// - If form was submitted and I go back to the url it should re-submit the form
// - Handle spamming the form ... debounc or something
// - Handle errors from the api
// - Handle no data from the api (nice message saying no data)
const { BrowserRouter: Router, Link, Route, Switch, useHistory, useLocation } = ReactRouterDOM;
const { useEffect, useState, useRef, Fragment } = React;

function Results({ error, results, display }) {
  if (!display) {
    return "";
  }

  const hasError = !!error.message;

  return (
    <Fragment>
      <h2>Results</h2>

      {(hasError &&
        <div style={{ color: "red" }}>{error.message}</div>
      )}

      {(!hasError && results.length === 0 &&
        <div style={{ color: "orange" }}>No results found</div>
      )}

      {results.map((r, idx) => (
        <div key={idx}>{r.name}</div>
      ))}
    </Fragment>
  );
}

function FormPage({ history, location }) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [results, setResults] = useState(null);
  const [resultsError, setResultsError] = useState({});

  const nameRef = useRef();

  const fetchResults = (name, { abortController }) => {
    console.log(`fetching data...${name}`);

    fetch(`/api?name=${name}`, { signal: abortController.signal })
      .then((res) => {
        if (res.status !== 200) {
          throw Error("request failed");
        }
        return res.json();
      })
      .then((results) => {
        setResults(results);
        setResultsError({});
        setIsSubmitting(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          console.log("aborted!");
        } else {
          setResults([]);
          setResultsError({ message: "request failed!", err });
          setIsSubmitting(false);
        }
      });
  };

  useEffect(() => {
    nameRef.current.focus();

    const abortController = new AbortController();

    const p = new URLSearchParams(location.search);

    setName(p.get("name") || "");

    if (p.get("submitted") === "t") {
      console.log("is submitting");
      setIsSubmitting(true);
      fetchResults(p.get("name"), { abortController });
    }
    return () => {
      setIsSubmitting(false);
      setResults(null);
      setResultsError({});
      abortController.abort();
    };
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    const q = new URLSearchParams({
      name,
      submitted: 't',
    });
    history.push(`?${q}`);
  };

  return (
    <Fragment>
      <h1>Hello form page!</h1>

      <form onSubmit={handleSubmit}>
        <input type="text" ref={nameRef} onChange={(e) => setName(e.target.value)} value={name} autoFocus />
        <input type="submit" value={isSubmitting ? "..." : "Go!"} />

        <Results error={resultsError} results={results} display={results !== null}/>
      </form>
    </Fragment>
  );
}

function App() {
  return (
    <Router>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Switch>
        <Route path="/" exact component={FormPage} />
        <Route path="/about" exact>
          <h1>Hello about us!</h1>
        </Route>
      </Switch>
    </Router>
  );
}

ReactDOM.render(<App/>, document.querySelector("#root"));
