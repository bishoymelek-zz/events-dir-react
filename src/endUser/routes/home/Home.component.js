import React, { Component } from 'react';
import Spinner from '../../../sharedComponents/Spinner';
// import clientsApi from '../../../api/clientsApi';
// import Button from 'react-bootstrap/Button'
import * as firebase from 'firebase';
var serviceAccount = require('../../../firebase.json');
var app = firebase.initializeApp(serviceAccount);

class Home extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      loadMoreAppsButton: {
        disable: false
      },
      eventsList: []
    }
    this.handleLoadMoreApps = this.handleLoadMoreApps.bind(this);
    this.arrOfEvents = [];
    var db = app.firestore();
    var first = db.collection('events').orderBy('date', 'asc')
    // .limit(3);

    first.get()
      .then((snapshot) => {
        // Get the last document
        // var last = snapshot.docs[snapshot.docs.length - 1];
        snapshot.forEach((doc) => {
          console.log("fff", doc.data());
          this.arrOfEvents.push(doc.data())
        });
        this.setState((prevState) => ({
          ...prevState,
          eventsList: this.arrOfEvents
        }))
      })
      .catch((err) => {
        console.log('Error getting documents', err);
      });

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
    const selfState = this.state;
    return (
      <React.Fragment>
        <Spinner loading={selfState.eventsList.length ? false : true}></Spinner>
        <div id="listing-cards">
          <header>
            <h1>Events Directory (Cairo - Egypt)</h1>
          </header>
          <section>
            <div className="container">
              {selfState.eventsList.length ? selfState.eventsList.map((one, index) => {
                return (
                  <div className="card-media">
                    <div className="card-media-object-container">
                      {/* <div className="card-media-object" style="background-image: url(https://s9.postimg.cc/y0sfm95gv/prince_f.jpg);">
</div> */}
                      {/* <span className="card-media-object-tag subtle">Selling Fast</span> */}
                      {/* <ul className="card-media-object-social-list">
                        <li>
                          <img alt="" src="https://s10.postimg.cc/3rjjbzcvd/profile_f.jpg" className="" />
                        </li>
                        <li>
                          <img alt="" src="https://s16.postimg.cc/b0j0djh79/profile_0_f.jpg" className="" />
                        </li>
                        <li className="card-media-object-social-list-item-additional">
                          <span>+2</span>
                        </li>
                      </ul> */}
                    </div>
                    <div className="card-media-body">
                      <div className="card-media-body-top">
                        <span className="subtle">{one.date}</span>
                        <span className="subtle">{one.time}</span>
                        {/* <div className="card-media-body-top-icons u-float-right">
                          <svg fill="#888888" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 0h24v24H0z" fill="none" />
                            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                          </svg>
                          <svg fill="#888888" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" />
                            <path d="M0 0h24v24H0z" fill="none" />
                          </svg>
                        </div> */}
                      </div>
                      <span className="card-media-body-heading">{one.name}: {one.desc}</span>
                      <div className="card-media-body-supporting-bottom">
                        <span className="card-media-body-supporting-bottom-text subtle">{one.address}</span>
                        <span className="card-media-body-supporting-bottom-text subtle u-float-right">{one.ticket_price} EGP</span>
                      </div>
                      <div className="card-media-body-supporting-bottom card-media-body-supporting-bottom-reveal">
                        <span className="card-media-body-supporting-bottom-text subtle">#{one.category}</span>
                        {/* <a href="#/" className="card-media-body-supporting-bottom-text card-media-link u-float-right">VIEW TICKETS</a> */}
                      </div>
                    </div>
                  </div>)

              }) : <h4>No events at the moment</h4>}
            </div>
          </section>
          <footer>
            <h6> Contacts: +201224941368</h6>
          </footer>
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
