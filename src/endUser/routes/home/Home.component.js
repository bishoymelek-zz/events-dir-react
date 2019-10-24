import React, { Component } from 'react';
import Spinner from '../../../sharedComponents/Spinner';
import Button from 'react-bootstrap/Button'
import * as firebase from 'firebase';
import logoIcon from './Logo.png';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Image from 'react-bootstrap/Image';
import CityDropDown from '../../../sharedComponents/CityBranchDropDown';
import CategoryDropDown from '../../../sharedComponents/CityBranchDropDown';

var serviceAccount = require('../../../firebase.json');
var app = firebase.initializeApp(serviceAccount);
var db = app.firestore();
const newDate = new Date();
const isoCurrentDate = newDate.toISOString("en-Eg");    

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      loading: true,
      loadMoreAppsButton: {
        disabled: false
      },
      eventsList: [],
      cityList: [],
      categoryList: [],
      categoryListObj: {},
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
      },
      lastItemId: null
    };
    this.handleDropDownFields = this.handleDropDownFields.bind(this);
    this.handleLoadMoreApps = this.handleLoadMoreApps.bind(this);
    this.handleFilters = this.handleFilters.bind(this);
    this.arrOfEvents = [];
    this.eventList = db.collection('event');
    var cityList = db.collection('city');
    var categoryList = db.collection('category');
    var organizationList = db.collection('organizationw');

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
        // console.log('Error getting documents', err);
      });

    organizationList
      .get()
      .then(snapshot => {
        let list = {};
        snapshot.forEach(doc => {
          list[doc.id] = {
            name: doc.data().name,
            // coords: doc.data().coords
          };
        });
        this.setState(prevState => ({
          ...prevState,
          organizationList: list
        }));
      })
      .catch(err => {
        // console.log('Error getting documents', err);
      });

    categoryList
      .get()
      .then(snapshot => {
        let list = [];
        let listObj = {};
        snapshot.forEach(doc => {
          list.push({ id: doc.id, name: doc.data().name });
          listObj[doc.id] = doc.data().name;
        });
        this.setState(prevState => ({
          ...prevState,
          categoryList: list,
          categoryListObj: listObj
        }));
      })
      .catch(err => {
        // console.log('Error getting documents', err);
      });
    this.eventList
      .limit(5)
      .where("date", ">=", isoCurrentDate)
      .get()
      .then(snapshot => {
        let Arr = [];
        snapshot.forEach(doc => {
          Arr.push(doc.data());
        });
        this.setState(prevState => ({
          ...prevState,
          eventsList: Arr,
          loading: false,
          hasError: false,
          lastItemId: snapshot.docs[Arr.length - 1]
        }));
      })
      .catch(err => {
        this.setState(prevState => ({
          ...prevState,
          hasError: true
        }));
       //  console.log("Error getting documents", err);
      });
  }

  handleLoadMoreApps() {
    const { lastItemId } = this.state;
    const newDate = new Date();
    const isoCurrentDate = newDate.toISOString("en-Eg");
    try {
      this.eventList
        .limit(5)
        .where("date", ">=", isoCurrentDate)
        .startAfter(lastItemId)
        .get()
        .then(snapshot => {
          const Arr = [];
          snapshot.forEach(doc => {
            Arr.push(doc.data());
          });
          const joined = this.state.eventsList.concat(Arr);
          this.setState(prevState => ({
            ...prevState,
            eventsList: joined,
            loading: false,
            hasError: false,
            lastItemId: snapshot.docs[snapshot.docs.length - 1]
          }));
        })
        .catch(err => {
          this.setState(prevState => ({
            ...prevState,
            hasError: true
          }));
         //  console.log("Error getting documents", err);
        });
    } catch (error) {
     //  console.log("hi", error);
        this.setState(prevState => ({
          ...prevState,
          loadMoreAppsButton: {
            ...prevState.loadMoreAppsButton,
            disabled: true
          }
        }));
    }
  }


  handleDropDownFields = (idx, title) => (key, event) => {
    const fieldName = event.target.name;
    const shouldClear = event.target.dataset.clear;
    if (fieldName === 'city') {
      if (shouldClear) {
        this.setState(prevState => ({
          ...prevState,
          cityToUse: {
            id: '',
            name: '',
            toBeUpdated: true
          }
        }));
      } else {
        this.setState(prevState => ({
          ...prevState,
          cityToUse: {
            id: idx,
            name: title,
            toBeUpdated: true
          }
        }));
      }
    } else if (fieldName === 'category') {
      if (shouldClear) {
        this.setState(prevState => ({
          ...prevState,
          categoryToUse: {
            id: '',
            name: '',
            toBeUpdated: true
          }
        }));
      }
      else {
        this.setState(prevState => ({
          ...prevState,
          categoryToUse: {
            id: idx,
            name: title,
            toBeUpdated: true
          }
        }));
      }
    }
  };

  componentDidUpdate() {
    const { cityToUse, categoryToUse } = this.state;
    if (cityToUse.toBeUpdated || categoryToUse.toBeUpdated) {
      this.setState(prevState => ({
        ...prevState,
        cityToUse: {
          ...prevState.cityToUse,
          toBeUpdated: false
        },
        categoryToUse: {
          ...prevState.categoryToUse,
          toBeUpdated: false
        }
      }));
      this.handleFilters();
    }
  }

  handleFilters() {
    const { cityToUse, categoryToUse, loading } = this.state;
    if (!loading) {
      this.setState((prevState) => ({
        ...prevState,
        loading: true,
      }));
    }
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
    } else {
      collec = db.collection('event');
    }    
    collec
      .where("date", ">=", isoCurrentDate)
      .limit(5)
      .get()
      .then(snapshot => {
        const list = [];
        snapshot.forEach(doc => {
          list.push(doc.data());
        });
        this.setState(prevState => ({
          ...prevState,
          eventsList: list,
          loadMoreAppsButton: {
            ...prevState.loadMoreAppsButton,
            disabled: false
          },
          hasError: false,
          cityToUse: { ...prevState.cityToUse, toBeUpdated: false },
          categoryToUse: { ...prevState.categoryToUse, toBeUpdated: false },
          loading: false
        }));
      })
      .catch(err => {
        // console.log("Error getting documents", err);
      });
  }

  render() {
    const {
      categoryList,
      cityList,
      organizationList
    } = this.state;
    const { loadMoreAppsButton, loading, cityToUse, categoryToUse, eventsList = [] } = this.state;    
    return (
      <React.Fragment>
        <header>
          <Navbar expand="lg" variant="light">
            <Nav className={"mr-auto"}>
              <Navbar.Brand>
                <Image id="logo-icon" src={logoIcon} fluid />
              </Navbar.Brand>
            </Nav>
            <Navbar.Text id="contact-num">
              <a href="tel:+201224941368">
                <i class="fa fa-mobile" aria-hidden="true" />
              </a>
            </Navbar.Text>
          </Navbar>
        </header>
        <Container fluid={true}>
          <section style={{ marginTop: "20px" }} id="filters">
            <Row>
              <Col xs={12} sm={6}>
                <CityDropDown
                  disabled={loading}
                  currentSelected={cityToUse.name}
                  name="city"
                  list={cityList}
                  fieldTitle={"City"}
                  handleItem={this.handleDropDownFields}
                />
              </Col>

              <Col xs={12} sm={6}>
                <CategoryDropDown
                  disabled={loading}
                  currentSelected={categoryToUse.name}
                  name="category"
                  list={categoryList}
                  fieldTitle={"Category"}
                  handleItem={this.handleDropDownFields}
                />
              </Col>
            </Row>
          </section>
          <div>
            <section id="listing-cards">
              <Spinner loading={loading} />
              <Row>
                <Col xs={12} sm={8} className="text-center">
                  <ul className="event-list">
                    {eventsList && eventsList.length ? (
                      eventsList.map((one, index) => {
                        const {
                          date,
                          time,
                          name,
                          desc,
                          ticket_price,
                          fb_url
                        } = one;
                        const dateObj = new Date(date);
                        const month = dateObj.toLocaleDateString("en-Eg", {
                          month: "short"
                        });
                        return (
                          <li key={index}>
                            <time dateTime={date}>
                              <span className="day">{dateObj.getDate()}</span>
                              <span className="month">{month}</span>
                              <span className="time">{time} AM</span>
                            </time>
                            <div className="info">
                              <h2 className="title">{name}</h2>
                              <p className="desc">{desc}</p>
                              <ul className="moreInfo">
                                <li>
                                  <span className="fa fa-money" />
                                  {ticket_price}
                                </li>
                              </ul>
                            </div>
                            <div className="social">
                              <ul>
                                {!fb_url ? null : (
                                  <li
                                    className="facebook"
                                    style={{ width: "33%" }}
                                  >
                                    <a href={fb_url} target={"_blank"}>
                                      <span className="fa fa-facebook" />
                                    </a>
                                  </li>
                                )}
                                <li
                                  className="twitter"
                                  style={{ width: "33%" }}
                                >
                                  <a
                                    href={
                                      " https://maps.google.com/?q=" +
                                        organizationList &&
                                      organizationList[one.organization] &&
                                      organizationList[one.organization].coords
                                    }
                                  >
                                    <i
                                      class="fa fa-map-marker"
                                      aria-hidden="true"
                                    />
                                  </a>
                                </li>
                                <li className="phone" style={{ width: "33%" }}>
                                  <a href="#phone">
                                    <i class="fa fa-phone" aria-hidden="true" />
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </li>
                        );
                      })
                    ) : (
                      <li>
                        <h5>No Events at the moment</h5>
                      </li>
                    )}
                  </ul>
                  <Button
                    disabled={loadMoreAppsButton.disabled}
                    id="load-more-btn"
                    onClick={this.handleLoadMoreApps}
                  >
                    Load More
                  </Button>
                </Col>
              </Row>
            </section>
          </div>
        </Container>
      </React.Fragment>
    );
  }
}

export default Home;
