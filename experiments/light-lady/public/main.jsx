// - Enter should submit form
// - Form data should be stored in query string
// - If form was submitted and I go back to the url it should re-submit the form
// - Handle spamming the form ... debounc or something
// - Handle errors from the api
// - Handle no data from the api (nice message saying no data)
const { HashRouter: Router, Link, Route, Switch, useHistory, useLocation } = ReactRouterDOM;
const { useEffect, useState, Fragment } = React;

function Results({ results, display }) {
  if (!display) {
    return "";
  }

  return (
    <Fragment>
      <h2>Results</h2>

      {results.map((r, idx) => (
        <div key={idx}>{r.title}</div>
      ))}
    </Fragment>
  );
}

function Form() {
  const history = useHistory();
  const location = useLocation();

  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);
  const [shouldSubmit, setShouldSubmit] = useState(false);

  const [results, setResults] = useState([]);

  const fetchResults = () => {
    console.log(`fetching data...${name}`);

    fetch(`/data.json?name=${name}`)
      .then((res) => res.json())
      .then((results) => {
        setTimeout(() => {
          setResults(results);
          setIsSubmitting(false);
        }, 2000);
      }).catch((err) => {
        console.error(err);
      });
  };

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault();
    }

    if (isSubmitting) {
      return;
    }

    if (e) {
      const q = new URLSearchParams({
        name,
        submitted: 't',
      });
      history.push(`?${q}`);
    }

    console.log("submitting");
    setSubmitCount((count) => count + 1);
    setIsSubmitting(true);

    fetchResults();
  };

  useEffect(() => {
    const p = new URLSearchParams(location.search);
    setName(p.get("name") || "");
    if (p.get("submitted") === "t") {
      setShouldSubmit(true);
    }
  }, [location]);

  useEffect(() => {
    if (shouldSubmit === true) {
      handleSubmit();
      setShouldSubmit(false);
    }
  }, [shouldSubmit]);

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" onChange={(e) => setName(e.target.value)} value={name} autoFocus/>
      <input type="submit" value={isSubmitting ? "..." : "Go!"} />

      <Results results={results} display={submitCount > 0 && !isSubmitting}/>
    </form>
  );
}

function FormPage({ location }) {
  return (
    <Fragment>
      <h1>Hello form page!</h1>
      <Form />
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
