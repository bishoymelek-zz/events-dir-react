import React, { Component } from 'react';
import Spinner from '../../../sharedComponents/Spinner';
import clientsApi from '../../../api/clientsApi';

class Home extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      loadMoreAppsButton: {
        disable: false
      }
    }
    this.handleLoadMoreApps = this.handleLoadMoreApps.bind(this);
  }

  componentDidMount() {
    if (!this.props.listOfDailyApps.length) {
      this.props.startLoading();
      this.props.getListOfApps();
    }
  }
  handleLoadMoreApps() {
    const selfProps = this.props;
    if (selfProps.appsListTotalPagesNum !== selfProps.appsListCurrentPage) {
      this.props.getListOfApps(this.props.appsListCurrentPage + 1);
    } else {
      this.setState((prevState) => ({
        ...prevState,
        loadMoreAppsButton: {
          ...prevState.loadMoreAppsButton,
          disable: true
        }
      }));
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.loading !== prevState.loading) {
      return { loading: nextProps.loading };
    }
    else return null;
  }
  render() {
    const selfProps = this.props;
    const selfState = this.state;
    return (
      <div id="sAdminHome">
        <Spinner loading={selfState.loading}></Spinner>
        <header>
          <h1>Rasidi Dashboard</h1>
        </header>
        <section>
          <div className="text-right">
            <button type="button" onClick={this.openModalHandler} className="btn btn-primary">Create/Update New item</button>
          </div>
        </section>
      </div>
    );
  }
}

export default Home;
