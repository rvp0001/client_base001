import { useState, useEffect, useMemo, useRef } from 'react'
import DatePicker from '../common/DatePicker/DatePicker'
import { FlatInput } from '../common/InputFields/Input/Input'
import { SelectInput } from '../common/InputFields/Select/Select'
import { SearchSelectInput } from '../common/InputFields/Select/SearchSelect'
import * as doctypes from '../common/Doctypes';
import { getDocs, getDocconfig, getLblVal, checkTouched, nvl, checkItem, isCheckedbool, getDocumenForSave } from '../common/CommonLogic';
import useSaveAction from '../Hooks/useSaveAction'
import { handleDelete, getRecommendations, handleSave,handlesendRecommendationNotification } from './CrudRecommendation'
import Messagesnackbar from '../common/Alert/Alert'
import AlertDialog from '../common/PopupModals/ConfirmationModal'
import {
  runCheck, requiredCheck, getDtFormat, getTimeFormat, getFromToDate, getDateYYYYMMDDHHMI, getDateYYYYMMDD, maxLength40, maxLength128,
  setErrorValue, getValue, setValue
} from '../common/validationlib';
import { Redirect, withRouter } from 'react-router-dom'
import AppbarBottom from '../common/AppBarBottom/AppbarBottom'
import { initDocumentstatus } from '../common/constant'
import { fetchStocks, addstocks } from '../Redux/ActionCreators'
import { connect } from 'react-redux';
import * as ActionTypes from '../Redux/ActionTypes'
import Loader from '../common/Loader/Loader'
import deleteGQL from '../mutations/DeleteRecommendation'
import { FileuploadComponent } from '../common/FileuploadComponent'
import { OnlineFileuploadComponent } from '../common/OnlineFileuploadComponent'
import shortid from 'shortid'

const newDocument = (doctype: String, doctypetext: String) => {
  return {
    doctype,
    doctypetext,
    status: 'active',
    validatemode: 'touch',
    uploadfiles: [],
    onlineuploadfiles: [],
    t_id: shortid.generate()
  }
};





export const handleSaveCheck = (currentdocument: any) => {
  const { touched, name, recodate, cmp, addupto, sl, target1, target2, weightage, timeframe, validatemode } = currentdocument;

  
console.log('nvl(target1, )',runCheck(nvl(target1, ''), [requiredCheck]))

  let name_check = runCheck(nvl(name, ''), [requiredCheck]);
  let recodate_check = runCheck(nvl(recodate, ''), [requiredCheck]);
  let cmp_check = runCheck(nvl(cmp, ''), [requiredCheck]);
  let addupto_check = runCheck(nvl(addupto, ''), [requiredCheck]);
  let sl_check = runCheck(nvl(sl, ''), [requiredCheck]);
  let target1_check = runCheck(nvl(target1, ''), [requiredCheck]);
  let target2_check = runCheck(nvl(target2, ''), [requiredCheck])
  let weightage_check = runCheck(nvl(weightage, ''), [requiredCheck]);
  let timeframe_check = runCheck(nvl(timeframe, ''), [requiredCheck]);
  console.log('currentdocument.errorsAll',currentdocument.errorsAll)
  if (validatemode == 'save') {
    currentdocument.errorsAll = {
      name: name_check,
      recodate: recodate_check,
      cmp: cmp_check,
      addupto: addupto_check,
      sl: sl_check,
      target1: target1_check,
      target2: target2_check,
      weightage: weightage_check,
      timeframe: timeframe_check,
    }
    validatemode == 'touch' 
  }
  if (validatemode == 'touch' && touched != null) {
    currentdocument.errorsAll = {
      name: checkTouched(nvl(touched.name, false), name_check),
      recodate: checkTouched(nvl(touched.recodate, false), recodate_check),
      cmp: checkTouched(nvl(touched.cmp, false), cmp_check),
      addupto: checkTouched(nvl(touched.addupto, false), addupto_check),
      sl: checkTouched(nvl(touched.sl, false), sl_check),
      target1: checkTouched(nvl(touched.target1, false), target1_check),
      target2: checkTouched(nvl(touched.target2, false), target2_check),
      weightage: checkTouched(nvl(touched.weightage, false), weightage_check),
      timeframe: checkTouched(nvl(touched.timeframe, false), timeframe_check),
    }
  }


  return currentdocument;
}

const timeframeoptions = [{ 'key': '0', 'value': '0' },
{ 'key': '1', 'value': '1' },
{ 'key': '3', 'value': '3' },
{ 'key': '6', 'value': '6' },
{ 'key': '12', 'value': '12' },
{ 'key': '12|18', 'value': '12|18' },
{ 'key': '12|24', 'value': '12|24' },
{ 'key': '3|6', 'value': '3|6' },
{ 'key': '3|6|9', 'value': '3|6|9' },
{ 'key': '3|6|9|12', 'value': '3|6|9|12' },
{ 'key': '3|9', 'value': '3|9' },
{ 'key': '6|24', 'value': '6|24' }
]

export const RecommendationComponent = (props: any) => {
  const compinp: any = useRef(0)
  const doctype = doctypes.RECOMMENDATION;
  const doctypetext = 'Recommendation';
  const resetFocus = () => {
    setTimeout(() => compinp.current.focus(), 1000)
  }
  const [setDocumentAction, documentstatus, setDocumentstatus, currentdocument, modifydocument, redirect, goBack, closeSnackBar, loaderDisplay, setloaderDisplay]: any = useSaveAction(handleSave, handleSaveCheck, doctype, doctypetext, resetFocus, deleteGQL)
  const [stocklist, setstocklist] = useState([])

  useEffect(() => {
    let z_id = new URLSearchParams(props.location.search).get("z_id")
    compinp.current.focus()
    if (z_id != 'NO-ID') {
      setloaderDisplay(true)
      getRecommendations({ applicationid: '15001500', client: '45004500', lang: 'EN', z_id }).then((data: any) => {
        modifydocument(data[0])
        setloaderDisplay(false)
      });
    }
    if (z_id == 'NO-ID') {


      modifydocument(newDocument(doctype, doctypetext));

    }
  }, [])
  const getStockcmp = () => {
    setloaderDisplay(true); compinp.current.focus()
    fetchStocks({},

      (err: any, result: any): any => {
        if (err == '') { console.log(result); props.addstocks(result); setloaderDisplay(false) }
        else { console.log(err, result) }
      })
  }

  const { action, yesaction, noaction, dailogtext, dailogtitle } = documentstatus;
  if (stocklist && props ?.stocks && stocklist ?.length !== props ?.stocks ?.length) {
    setstocklist(props.stocks.map((el: any) => { return { value: el.name, label: el.name } }));
  }




  const M_stocklist = useMemo(() => stocklist, [stocklist])
  if (redirect) {
    let redirectpath = '/Recommendations'
    return <Redirect push to={redirectpath} />;
  } else

  {


  
    let currentdocument1=handleSaveCheck(currentdocument);

    return (
      <>
        <Loader display={loaderDisplay} />
        <div className="container">
          <div className="grid">
     
            <div className="row">
              <SearchSelectInput inpref={compinp} wd="3" label="" options={M_stocklist} name="name" currdoc={currentdocument1} section={'name'} modifydoc={modifydocument} refresh={getStockcmp} />
              <DatePicker wd="3" label="Recommendation Date" name="recodate" currdoc={currentdocument1} section={'recodate'} modifydoc={modifydocument} format="yyyymmdd" />
              <FlatInput wd="3" label="Current market price" name="cmp" currdoc={currentdocument1} section={'cmp'} modifydoc={modifydocument} />
              <div className={"col-3"}></div>
            </div>
            <div className="row">
              <FlatInput wd="3" label="Add Up To" name="addupto" currdoc={currentdocument1} section={'addupto'} modifydoc={modifydocument} />
              <FlatInput wd="3" label="Stop Loss" name="sl" currdoc={currentdocument1} section={'sl'} modifydoc={modifydocument} />
              <div className={"col-6"}></div>
            </div>
            <div className="row">
              <FlatInput wd="3" label="Weightage" name="weightage" currdoc={currentdocument1} section={'weightage'} modifydoc={modifydocument} />
              <SelectInput wd="3" label="Time Frame" options={timeframeoptions} name="timeframe" currdoc={currentdocument1} section={'timeframe'} modifydoc={modifydocument} />
              <div className={"col-3"}></div>
              <div className={"col-3"}></div>
            </div>
            <div className="row">
              <FlatInput wd="3" label="Target 1" name="target1" currdoc={currentdocument1} section={'target1'} modifydoc={modifydocument} />
              <FlatInput wd="3" label="Target 2" name="target2" currdoc={currentdocument1} section={'target2'} modifydoc={modifydocument} />
              <FlatInput wd="3" label="Target 3" name="target3" currdoc={currentdocument1} section={'target3'} modifydoc={modifydocument} />
              <div className={"col-3"}></div>
            </div>
            <div className="row">
              <FlatInput wd="3" label="Target 4" name="target4" currdoc={currentdocument1} section={'target4'} modifydoc={modifydocument} />
              <FlatInput wd="3" label="Target 5" name="target5" currdoc={currentdocument1} section={'target5'} modifydoc={modifydocument} />
              <FlatInput wd="3" label="Target 6" name="target6" currdoc={currentdocument1} section={'target6'} modifydoc={modifydocument} />
              <div className={"col-3"}></div>
            </div>
            <div className="row">
              <FlatInput wd="3" label="Target 7" name="target7" currdoc={currentdocument1} section={'target7'} modifydoc={modifydocument} />
              <FlatInput wd="3" label="Target 8" name="target8" currdoc={currentdocument1} section={'target8'} modifydoc={modifydocument} />
              <FlatInput wd="3" label="Target 9" name="target9" currdoc={currentdocument1} section={'target9'} modifydoc={modifydocument} />
              <div className={"col-3"}></div>
            </div>
 
            <div className="row">
            <button onClick={()=>{handlesendRecommendationNotification(currentdocument1)}}>
                  Send Notication 
            </button>
            </div>

               <div className="row">
              <OnlineFileuploadComponent
                section={'reffiles'}
                autoupload={true}
               
                saveasis={() => {  }}
                currdoc={currentdocument1}
                modifydoc={modifydocument}
              />

            </div>
          </div>
          <AlertDialog open={action} handleno={noaction} handleyes={yesaction} dailogtext={dailogtext} dailogtitle={dailogtitle} />
          <Messagesnackbar snackbaropen={documentstatus.snackbaropen} snackbarseverity={documentstatus.snackbarseverity} handlesnackbarclose={closeSnackBar} snackbartext={documentstatus.snackbartext} />
        </div>
        <AppbarBottom setAction={setDocumentAction} handleGoback={goBack} setfocus={resetFocus} />
      </>
    )

  }
}

const mapDispatchToProps = (dispatch: any) => ({
  addstocks: (stocks: any, callback: any) => {
    console.log(addstocks(stocks)); dispatch(addstocks(stocks));
    if (callback && typeof callback === "function") {
      callback();
    }
  }
})

const mapStateToProps = (state: any) => {

  return {
    stocks: state.stocks.stocks.stocks,

  }
}



export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RecommendationComponent));

