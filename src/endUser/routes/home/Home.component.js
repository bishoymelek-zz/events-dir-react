import React, { Component } from 'react';
import Spinner from '../../../sharedComponents/Spinner';
import clientsApi from '../../../api/clientsApi';
import Button from 'react-bootstrap/Button'
import * as firebase from 'firebase';
var serviceAccount = require('../../../firebase.json');
var app = firebase.initializeApp(
  serviceAccount);

var db = app.firestore();
db.collection('events').get()
  .then((snapshot) => {
    snapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
    });
  })
  .catch((err) => {
    console.log('Error getting documents', err);
  });

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
      <div id="listing-cards">
        <Spinner loading={selfState.loading}></Spinner>
        <header>
          <h1>Rasidi Dashboard</h1>
        </header>
        <section>
          <div className="container">
            <div className="row">
              {/* <div className="col-12 col-sm-6 col-lg-4">
                <div className="card bg-light">
                  <div className="card-body">
                    <h4 className="card-title">Bologna</h4>
                    <h6 className="card-subtitle mb-2">Emilia-Romagna Region, Italy</h6>
                    <p className="card-text">It is the seventh most populous city in Italy, at the heart of a metropolitan area of about one million people. </p>
                  </div>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <div className="card bg-secondary text-white">
                  <div className="card-body">
                    <h4 className="card-title">Oslo</h4>
                    <h6 className="card-subtitle mb-2">Oslofjord, Norway</h6>
                    <p className="card-text">Oslo is the economic and governmental centre of Norway. The city is also a hub of Norwegian trade, banking and industry.</p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-4">
                <div className="card bg-dark text-white">
                  <div className="card-body">
                    <h4 className="card-title">Berlin</h4>
                    <h6 className="card-subtitle mb-2">Brandenburg, Germany</h6>
                    <p className="card-text">Berlin is a world city of culture, politics, media and science. Its economy is based on high-tech firms and the service sector.</p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-4">
                <div className="card bg-primary text-white">
                  <div className="card-body">
                    <h4 className="card-title">Bucharest</h4>
                    <h6 className="card-subtitle mb-2">Romania</h6>
                    <p className="card-text">Economically, Bucharest is the most prosperous city in Romania and one of the main industrial centres of Eastern Europe. </p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-4">
                <div className="card bg-info">
                  <div className="card-body">
                    <h4 className="card-title">Madrid</h4>
                    <h6 className="card-subtitle mb-2">Spain</h6>
                    <p className="card-text">The city has almost 3.2 million inhabitants and a metropolitan area population of approximately 6.5 million.</p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-4">
                <div className="card bg-success">
                  <div className="card-body">
                    <h4 className="card-title">London</h4>
                    <h6 className="card-subtitle mb-2">Greater London, England</h6>
                    <p className="card-text">London is one of the leading global cities in the arts, commerce, education, entertainment, fashion.</p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-4">
                <div className="card bg-warning">
                  <div className="card-body">
                    <h4 className="card-title">Vienna</h4>
                    <h6 className="card-subtitle mb-2">Austria</h6>
                    <p className="card-text">Apart from being regarded as the City of Music because of its musical legacy, it is also said to be "The City of Dreams".</p>
                  </div>
                </div>
              </div>

              <div className="col-12 col-sm-6 col-lg-4">
                <div className="card bg-danger text-white">
                  <div className="card-body">
                    <h4 className="card-title">Amsterdam</h4>
                    <h6 className="card-subtitle mb-2">Netherlands</h6>
                    <p className="card-text">Originating as a small fishing village, Amsterdam became one of the most important ports in the world.</p>
                  </div>
                </div>
              </div> */}

              <div className="col-12 col-sm-6 col-lg-4">
                <div className="card bg-transparent">
                  <div className="card-body">
                    <h4 className="card-title">Vladivostok</h4>
                    <h6 className="card-subtitle mb-2">Primorsky Krai, Russia</h6>
                    <p className="card-text">The city is the home port of the Russian Pacific Fleet and the largest Russian port on the Pacific Ocean.</p>
                  </div>
                </div>
              </div>
            </div>
            <Button id="loadMoreButton" onClick={this.handleLoadMoreApps} disabled={false} variant="primary">Load More</Button>
          </div>
        </section>
      </div>
    );
  }
}

export default Home;
