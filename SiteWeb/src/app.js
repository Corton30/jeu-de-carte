const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/login" component={Login} />
                <Route path="/api/create-account" component={SignUp} />
            </Switch>
        </Router>
    );
};