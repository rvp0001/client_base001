import React, { useState, useCallback } from 'react'
import { M_MenuItem } from '../common/MenuItem'
import {connect} from 'react-redux'
import {useAltKey,useKey} from '../../common/shortcurkeys'
import {Redirect,withRouter } from 'react-router-dom'
import {handleSignoutUsernameJWT,checkCurrentUsernameJWT,ActionToDispatch,ActionToRedirect} from '../Redux/reducers/actions'
export function SupplierMenu(props: any) {
  const { selectcomponent,systemsRedirect } = props
  const menuList = [
    {
      name: 'Manage Bid',
      component: '',
      slug: '/managebid',
      iconName: 'las la-igloo',
      active: '',
    },
    {
      name: 'Manage Password',
      component: '',
      slug: '/managePassword',
      iconName: 'las fa-comment-alt',
      active: '',
    },
    
    {
      name: 'Back To Systems',
      component: '',
      slug: '',
      iconName: 'las la-power-off',
      active: '',
    },
  ]
  const redirectto=(redirectpath:String)=>{
    return <Redirect  to={redirectpath} />
  }
  useAltKey("r",() =>{redirectto('/Recommendations')})
  useAltKey("u",() =>{redirectto('/Users')})
  const [activeMenu, setActiveMenu] = useState(menuList[0].name)
  const [displayMenu,setDisplayMenu] = useState(false)
  function selectItem(menuItem: string) {
    setActiveMenu(menuItem)
    selectcomponent(menuItem)
    if(menuItem === 'Back To Systems'){
        systemsRedirect(true)
    }
  }
  const M_selectItem = useCallback(selectItem, [])
  const handleProcessLogout=async()=> {
       
    handleSignoutUsernameJWT(async () =>
  {
    props.ActionToRedirect('/Systems');
          // checkCurrentUsernameJWT((err:any,result:any)=>
          // { 
          //       console.log('In result handleSignoutUsernameJWT');
          //    if(!result)
          //     {
          //       console.log('In result handleSignoutUsernameJWT -1');
          //         props.ActionToDispatch({ type: 'UNAUTH_USER' ,payload : [''] });
          //         props.ActionToRedirect('/Systems');
          //     } 
          //     else
          //     {
          //       console.log('In result handleSignoutUsernameJWT-2');
          //         props.ActionToDispatch({ type: 'AUTH_ERROR' ,payload : err });
               
          //     }
          // }
     // );
  
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

export const SideBar= React.memo(withRouter(connect(null,{ ActionToDispatch,ActionToRedirect})(SupplierMenu)))
