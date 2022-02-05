import React, { useState } from 'react'
import AppbarBottom from '../common/AppBarBottom/AppbarBottom'
import AddFabButton from '../common/Fab/AddFabButton'
import Customers from '../Customers/Customers'
import Customer from '../Customers/customer'
import Projects from '../Projects/Projects'
import Header from './Header/Header'
import IndicatorCards from './Indicators/IndicatorCards'
import {SideBar} from './Menu/SideBar'
import { Input } from '../common/InputFields/Input/Input'
import { Select } from '../common/InputFields/Select/Select'
import Inventery from '../Inventory/Inventery'
import { Button } from '../common/Button/Button'
import {connect} from 'react-redux'
import UserComponent from '../User/UserComponent'
import UserListComponent from '../User/UserListComponent'
import RecommendationList from '../recommendation/RecommendationList'
import RecommendationComponent from '../recommendation/RecommendationComponent'
import {BrowserRouter as Rounter, Route, Switch} from 'react-router-dom'
import { SearchSelectInput } from '../common/InputFields/Select/SearchSelectInput'
//import {getUsers,addusers} from '../Redux/ActionCreators'



const DashboardComponent = (props: any) => {
  return (
    <>
      <IndicatorCards />
      <div className="recent-grid">
        <Projects />
        <Customers />
        <SearchSelectInput wd="3" label="Weightage" name="weightage" currdoc={{}} section={'weightage'} modifydoc={()=>{}}/>
      </div>
    </>
  )
}

function Dashboard(props: any) {
  console.log('in dashboard')
  const [displayComponent, setDisplayComponent] = useState('Dashboard')
  return (
    <Rounter>
      <SideBar selectcomponent={setDisplayComponent} />
      <div className="main-content">
        <Header title={displayComponent} />
        <main>
          <Switch>
            <Route exact path="/">
              <DashboardComponent {...props}/>
            </Route>
            <Route exact path="/Users">
              <UserListComponent {...props}/>
            </Route>
            <Route exact path="/useredit">
              <UserComponent {...props}/>
            </Route>
            <Route exact path="/Recommendations">
              <RecommendationList {...props}/>
            </Route>
            <Route exact path="/recommendationedit">
              <RecommendationComponent {...props}/>
            </Route>
          
          </Switch>
        </main>
      </div>
      </Rounter>
    
  )
}

const mapStateToProps=(state:any)=>{
return {
  users:state.users
}
}
const mapdispatcherToProp=(dispatch:any)=>{
  return {
    //addusers :(users:any)=> dispatch(addusers(users))
  }
}
export default connect(mapStateToProps,mapdispatcherToProp)(Dashboard);
