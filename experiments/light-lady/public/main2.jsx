// - Enter should submit form
// - Form data should be stored in query string
// - If form was submitted and I go back to the url it should re-submit the form
// - Handle spamming the form ... debounc or something
// - Handle errors from the api
// - Handle no data from the api (nice message saying no data)
const { BrowserRouter: Router, Link, Route, Switch, useHistory, useLocation } = ReactRouterDOM;
const { useEffect, useState, useRef, useReducer, Fragment } = React;

const defaultState = {
  isLoading: false,
  isError: false,
  data: [],
  dataLoaded: false,
};
const getResultsReducer = (state, action) => {
  switch (action.type) {
    case "init":
      return {
        ...defaultState,
        isLoading: true,
      };
    case "success":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
        dataLoaded: true,
      };
    case "failed":
      return {
        ...state,
        isLoading: false,
        isError: true,
        data: [],
        dataLoaded: false,
      };
    default:
      throw new Error();
  }
};

const useApi = () => {
  const [params, setParams] = useState([]);

  const [state, dispatch] = useReducer(getResultsReducer, defaultState);

  const abortController = new AbortController();

  useEffect(() => {
    if (params.length === 0) {
      return;
    }

    let didUnmount = false;
    const searchParams = new URLSearchParams(params);
    const fetchData = async () => {
      try {
        dispatch({ type: "init" });
        const res = await fetch(`/api?${searchParams.toString()}`, { signal: abortController.signal });
        if (res.status !== 200) {
          throw new Error();
        }
        const data = await res.json();
        if (!didUnmount) {
          dispatch({ type: "success", payload: data });
        }
      } catch (err) {
        if (!didUnmount) {
          dispatch({ type: 'failed' });
        }
      }
    };

    fetchData();

    return () => {
      didUnmount = true;
      abortController.abort();
    };
  }, [params]);

  return [state, setParams];
};

function ReportPage({ history, location }) {
  const [api, fetchData] = useApi();

  const [name, setName] = useState("");
  const dataRef = useRef();

  useEffect(() => {
    if (api.isLoading || !api.dataLoaded || !dataRef.current) {
      return;
    }
    console.log("scrolling");
    dataRef.current.scrollIntoView({ behavior: "smooth" });
  }, [api.isLoading]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setName(searchParams.get("name") || "");

    if (searchParams.get("submitted") === "t") {
      fetchData(searchParams.entries());
    }
  }, [location]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (api.isLoading) {
      return;
    }

    const q = new URLSearchParams({
      name,
      submitted: 't',
    });
    history.push(`?${q}`);
  };

  return (
    <Fragment>
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit">{api.isLoading ? "..." : (<Fragment>Go &rarr;</Fragment>)}</button>
        <hr/>
        {api.isLoading && <div>Loading...</div>}
        {api.isError && (
          <div style={{ color: "red" }}>Something bad happened...</div>
        )}
        {api.dataLoaded && (
          <Fragment>
            <h2 ref={dataRef}>Data</h2>
            {api.data.map((d, idx) => (
              <div key={idx}>{d.name}</div>
            ))}
            {api.data.length === 0 && (
              <div style={{ color: "orange" }}>No data found...</div>
            )}
          </Fragment>
        )}
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
        <Route path="/" exact component={ReportPage}/>
        <Route path="/about" exact>
          <h1>Hello about us!</h1>
        </Route>
      </Switch>
    </Router>
  );
}

ReactDOM.render(<App/>, document.querySelector("#root"));
