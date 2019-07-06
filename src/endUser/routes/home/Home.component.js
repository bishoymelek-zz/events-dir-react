import React, { Component } from 'react';
import Spinner from '../../../sharedComponents/Spinner';
// import clientsApi from '../../../api/clientsApi';
// import Button from 'react-bootstrap/Button'
import * as firebase from 'firebase';
import markerPin from './marker-pin.png';
import logoIcon from './icon_small.png';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Image from 'react-bootstrap/Image';
import CityDropDown from '../../../sharedComponents/CityBranchDropDown';
import CategoryDropDown from '../../../sharedComponents/CityBranchDropDown';

var serviceAccount = require('../../../firebase.json');
var app = firebase.initializeApp(serviceAccount);
var db = app.firestore();

class Home extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      loadMoreAppsButton: {
        disable: false
      },
      eventsList: [],
      cityList: [],
      categoryList: [],
      organizationList: [],
      cityToUse: {
        id: '',
        toBeUpdated: false,
        name: ''
      },
      categoryToUse: {
        id: '',
        toBeUpdated: false,
        name: ''
      }
    };
    this.handleDropDownFields = this.handleDropDownFields.bind(this);
    this.handleLoadMoreApps = this.handleLoadMoreApps.bind(this);
    this.handleFilters = this.handleFilters.bind(this);
    this.arrOfEvents = [];
    var eventList = db.collection('event');
    var cityList = db.collection('city');
    var categoryList = db.collection('category');
    var organizationList = db.collection('organization');

    cityList
      .get()
      .then(snapshot => {
        let list = [];
        snapshot.forEach(doc => {
          list.push({ id: doc.id, name: doc.data().name });
        });
        this.setState(prevState => ({
          ...prevState,
          cityList: list
        }));
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });

    organizationList
      .get()
      .then(snapshot => {
        let list = {};
        snapshot.forEach(doc => {
          list[doc.id] = {
            name: doc.data().name,
            coords: doc.data().coords
          };
        });
        this.setState(prevState => ({
          ...prevState,
          organizationList: list
        }));
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });

    categoryList
      .get()
      .then(snapshot => {
        let list = [];
        snapshot.forEach(doc => {
          list.push({ id: doc.id, name: doc.data().name });
        });
        this.setState(prevState => ({
          ...prevState,
          categoryList: list
        }));
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });

    eventList
      .get()
      .then(snapshot => {
        snapshot.forEach(doc => {
          this.arrOfEvents.push(doc.data());
        });
        this.setState(prevState => ({
          ...prevState,
          eventsList: this.arrOfEvents,
          loading: false
        }));
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }

  handleLoadMoreApps() {
    const selfProps = this.props;
    if (selfProps.appsListTotalPagesNum !== selfProps.appsListCurrentPage) {
      this.props.getListOfApps(this.props.appsListCurrentPage + 1);
    } else {
      this.setState(prevState => ({
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
    } else return null;
  }

  handleDropDownFields = (idx, title) => (key, event) => {
    const fieldName = event.target.name;
    if (fieldName === 'city') {
      this.setState(prevState => ({
        ...prevState,
        cityToUse: {
          id: idx,
          name: title,
          toBeUpdated: true
        }
      }));
    } else if (fieldName === 'category') {
      this.setState(prevState => ({
        ...prevState,
        categoryToUse: {
          id: idx,
          name: title,
          toBeUpdated: true
        }
      }));
    }
  };

  componentDidUpdate() {
    const { cityToUse, categoryToUse } = this.state;
    if (
      (cityToUse.id && cityToUse.toBeUpdated) ||
      (categoryToUse.id && categoryToUse.toBeUpdated)
    ) {
      this.handleFilters();
    }
  }

  handleFilters() {
    const { cityToUse, categoryToUse } = this.state;
    let collec;
    if (cityToUse.id && categoryToUse.id) {
      collec = db
        .collection('event')
        .where('city', '==', cityToUse.id)
        .where('category', '==', categoryToUse.id);
    } else if (cityToUse.id) {
      collec = db.collection('event').where('city', '==', cityToUse.id);
    } else if (categoryToUse.id) {
      collec = db.collection('event').where('category', '==', categoryToUse.id);
    }
    collec
      .get()
      .then(snapshot => {
        const list = [];
        snapshot.forEach(doc => {
          list.push(doc.data());
        });
        this.setState(prevState => ({
          ...prevState,
          eventsList: list,
          cityToUse: { ...prevState.cityToUse, toBeUpdated: false },
          categoryToUse: { ...prevState.categoryToUse, toBeUpdated: false }
        }));
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }

  render() {
    const { categoryList, cityList, organizationList } = this.state;
    const selfState = this.state;
    const dateOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return (
      <React.Fragment>
        <Spinner loading={selfState.loading} />
        <header>
          <Navbar expand="lg" variant="light">
            <Navbar.Brand>
              <Image id="logo-icon" src={logoIcon} fluid />
              {'Pharos Events'}
            </Navbar.Brand>
            <Navbar.Text id="contact-num">
              <a href="tel:+201224941368">Contact Us</a>
            </Navbar.Text>
          </Navbar>
        </header>
        <Container fluid={true}>
          <section style={{ marginTop: '20px' }}>
            <Row>
              <Col xs={12} sm={6}>
                <CityDropDown
                  currentSelected={this.state.cityToUse.name}
                  name="city"
                  list={cityList}
                  fieldTitle={'City'}
                  handleItem={this.handleDropDownFields}
                />
              </Col>

              <Col xs={12} sm={6}>
                <CategoryDropDown
                  currentSelected={this.state.categoryToUse.name}
                  name="category"
                  list={categoryList}
                  fieldTitle={'Category'}
                  handleItem={this.handleDropDownFields}
                />
              </Col>
            </Row>
          </section>
          <div id="listing-cards">
            <section>
              <Row>
                {selfState.eventsList && selfState.eventsList.length ? (
                  selfState.eventsList.map((one, index) => {
                    return (
                      <Col xs={12} className="card-media">
                        <div className="card-media-body">
                          <div className="card-media-body-top">
                            <span className="subtle">{`${one.time}  |  `}</span>
                            <span className="subtle">{`${new Date(
                              one.date
                            ).toLocaleDateString('en-EG', dateOptions)}`}</span>

                            <span className="eve-location">
                              <a
                                href={
                                  ' https://maps.google.com/?q=' +
                                  organizationList[one.organization].coords
                                }
                              >
                                <h6>
                                  {organizationList[one.organization].name}
                                </h6>
                                <img
                                  style={{ width: '25px', float: 'right' }}
                                  src={markerPin}
                                  alt="pin-marker"
                                />
                              </a>
                            </span>
                          </div>
                          <span className="card-media-body-heading eve-title">
                            {one.name}
                          </span>
                          <span className="card-media-body-supporting-bottom-text subtle">
                            #{categoryList[one.category]}
                          </span>
                          <span className="card-media-body-supporting-bottom-text subtle u-float-right">
                            {one.ticket_price} EGP
                          </span>
                          <div className="card-media-body-heading eve-desc">
                            {one.desc}
                          </div>
                        </div>
                      </Col>
                    );
                  })
                ) : (
                  <h4>No events at the moment</h4>
                )}
              </Row>
            </section>
          </div>
        </Container>
      </React.Fragment>
    );
  }
}

export default Home;
