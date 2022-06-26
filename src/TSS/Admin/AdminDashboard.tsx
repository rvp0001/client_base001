import React,{useState} from 'react'
import {BrowserRouter as Rounter, Route, Switch} from 'react-router-dom'
import Header from '../common/Header'
import { SideBar } from './AdminMenu'
function AdminDashboard(props:any) {
    const {systemsRedirect}=props
    const [displayComponent, setDisplayComponent] = useState('Dashboard')
    return (!props.displaySystem ?
      <Rounter>
        <SideBar selectcomponent={setDisplayComponent}  systemsRedirect={systemsRedirect}/>
        <div className="main-content">
          <Header title={displayComponent} />
          
          <main>
          <div onClick={()=>systemsRedirect(true)}>back</div>
            <Switch>
              <Route exact path="/userManagement">
                <></>
              </Route>
              <Route exact path="/productManagement">
              <></>
              </Route>
              <Route exact path="/bidderManagement">
              <></>
              </Route>
              <Route exact path="/supplierBuyerMapping">
              <></>
              </Route>
              
            </Switch>
          </main>
        </div>
        </Rounter>:<></>
    )
}

export default AdminDashboard