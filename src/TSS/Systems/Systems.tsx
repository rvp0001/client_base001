import React,{useState} from 'react'
import './systems.css'
import { BrowserRouter as Rounter, Route, Switch,Link  } from 'react-router-dom'
import AdminDashboard from '../Admin/AdminDashboard'
import SupplierDashboard from '../Supplier/SupplierDashboard'
import BuyerDashboard from '../Buyer/BuyerDashboard'
export const Systems = (props: any) => {
  const [displaySystem, setDisplaysystem] = useState(true); 
  return (<>
    <Rounter>
      
      {displaySystem? <div className='system-container'>
        <Link  to={"/adminDashboard"}><div className='card' onClick={()=>setDisplaysystem(!displaySystem)}>Admins</div></Link >
        <Link  to={"/supplierDashboard"}><div className='card' onClick={()=>setDisplaysystem(!displaySystem)}>Suppliers</div></Link >
        <Link  to={"/buyerDashboard"}><div className='card' onClick={()=>setDisplaysystem(!displaySystem)}>Buyers</div></Link >
      </div>:<></>}
      <Switch>
        <Route exact path="/adminDashboard">
          <AdminDashboard {...props} systemsRedirect={setDisplaysystem} displaySystem = {displaySystem}/>
        </Route>
        <Route exact path="/supplierDashboard">
          <SupplierDashboard {...props} systemsRedirect={setDisplaysystem} displaySystem = {displaySystem}/>
        </Route>
        <Route exact path="/buyerDashboard">
          <BuyerDashboard {...props} systemsRedirect={setDisplaysystem} displaySystem = {displaySystem}/>
        </Route>
      </Switch>
    </Rounter>
  </>
  )
}
