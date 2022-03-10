import React, { useState, useCallback } from 'react'
import { M_MenuItem } from './MenuItem'
import {connect} from 'react-redux'
import {useAltKey,useKey} from '../../../common/shortcurkeys'
import {Redirect,withRouter } from 'react-router-dom'
import {handleSignoutUsernameJWT,checkCurrentUsernameJWT,ActionToDispatch,ActionToRedirect} from '../../Redux/reducers/actions'
export function SideBar1(props: any) {
  const { selectcomponent } = props
  const menuList = [
    {
      name: 'Dashboard',
      component: '',
      slug: '/',
      iconName: 'las la-igloo',
      active: '',
    },
    {
      name: 'Recommendations',
      component: '',
      slug: '/Recommendations',
      iconName: 'las fa-comment-alt',
      active: '',
    },
    {
      name: 'Projects',
      component: '',
      slug: '/Projects',
      iconName: 'las la-clipboard-list',
      active: '',
    },
    {
      name: 'Orders',
      component: '',
      slug: '/Orders',
      iconName: 'las la-shopping-bag',
      active: '',
    },
    {
      name: 'Inventory',
      component: '',
      slug: '/Inventory',
      iconName: 'las la-receipt',
      active: '',
    },
    {
      name: 'Accounts',
      component: '',
      slug: '/Accounts',
      iconName: 'las la-user-circle',
      active: '',
    },
    {
      name: 'Tasks',
      component: '',
      slug: '',
      iconName: 'las la-clipboard-list',
      active: '',
    },
    {
      name: 'Users',
      component: '',
      slug: '/Users',
      iconName: 'las la-users',
      active: 'active',
    },
    {
      name: 'Logout',
      component: '',
      slug: '',
      iconName: 'las la-power-off',
      active: '',
    },
  ]
  const redirectto=(redirectpath:String)=>{
    return <Redirect push to={redirectpath} />
  }
  useAltKey("r",() =>{redirectto('/Recommendations')})
  useAltKey("u",() =>{redirectto('/Users')})
  const [activeMenu, setActiveMenu] = useState(menuList[0].name)
  const [displayMenu,setDisplayMenu] = useState(false)
  function selectItem(menuItem: string) {
    setActiveMenu(menuItem)
    selectcomponent(menuItem)
    if(menuItem === 'Logout'){
      handleProcessLogout()
    }
  }
  const M_selectItem = useCallback(selectItem, [])
  const handleProcessLogout=async()=> {
       
    handleSignoutUsernameJWT(async () =>
  {
           
          checkCurrentUsernameJWT((err:any,result:any)=>
          { 
                console.log('In result handleSignoutUsernameJWT');
             if(!result)
              {
                console.log('In result handleSignoutUsernameJWT -1');
                  props.ActionToDispatch({ type: 'UNAUTH_USER' ,payload : [''] });
                  props.ActionToRedirect('/signin');
              } 
              else
              {
                console.log('In result handleSignoutUsernameJWT-2');
                  props.ActionToDispatch({ type: 'AUTH_ERROR' ,payload : err });
               
              }
          }
      );
  
      }
   );
  
  
  }
  
  

    
  return (<>
  <input type="checkbox" id="nav-toggle" checked={displayMenu} onClick={()=>setDisplayMenu(!displayMenu)}/>
    <div className="sidebar">
      <div className="sidebar-brand">
        <h2>
          <span className="lab la-accusoft"></span>
          <span>ITFs</span>
        </h2>
      </div>
      <div className="sidebar-menu">
        {/* <ui> */}
        {menuList.map((menuitem, i) => {
          return (
            <M_MenuItem key={i+"_"+menuitem.name}
              menuname={menuitem.name}
              iconname={menuitem.iconName}
              active={activeMenu === menuitem.name ? 'active' : ''}
              selectItem={M_selectItem}
              slug={menuitem.slug}
              toggleMenu={setDisplayMenu}
            />
          )
        })}
        {/* </ui> */}
      </div>
    </div>
    </>
  )
}

export const SideBar= React.memo(withRouter(connect(null,{ ActionToDispatch,ActionToRedirect})(SideBar1)))
