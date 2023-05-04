import axios from 'axios';
import React from 'react';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { Button } from 'semantic-ui-react';
import GConf from '../../AssetsM/generalConf';
import { useNavigate} from 'react-router-dom';
import { useState } from 'react';

function DataBaseBU() {

    /* ############################### UseEffect ################################*/
    const navigate = useNavigate();
    let [fileSize , setFileSize] = useState(0)
    let [stockLink , setStockLink] = useState('')
    let [stockLinkBtn , setStockLinkBtn] = useState(true)

    let [factureLink , setFactureLink] = useState('')
    let [factureLinkBtn , setFactureLinkBtn] = useState(true)

    let [commandeLink , setCommandeLink] = useState('')
    let [commandeLinkBtn , setCommandeLinkBtn] = useState(true)

    let [clientLink , setClientLink] = useState('')
    let [clientLinkBtn , setClientLinkBtn] = useState(true)

    let [stockCamionLink , setStockCamionLink] = useState('')
    let [stockCamionLinkBtn , setStockCamionLinkBtn] = useState(true)

    /* ############################### UseEffect ################################*/
    useEffect(() => {
        axios.post(`${GConf.ApiLink}/tools/export/calcsize`, {
            tag: GConf.SystemTag,
        })
        .then(function (response) {
            setFileSize(response.data.totSize)
        })
    }, [])

    /* ############################### Function ################################*/
    const NavigateFunction = (link) => {  navigate(link) }
    const ExportFlies = (table,file) => {
        console.log(table)
        console.log(file)
        axios.post(`${GConf.ApiLink}/tools/export/done`, {
            tag: GConf.SystemTag,
            tableName: table,
            fileName: file,
            conditionState: 'Caisse_ID = 1111111111',
        })
        .then(function (response) {
            switch (file) {
                case 'Stock':
                    setStockLink(response.data.file)
                    setStockLinkBtn(false)
                    break;
                case 'Factures':
                    setFactureLink(response.data.file)
                    setFactureLinkBtn(false)
                    break;
                case 'Commande':
                    setCommandeLink(response.data.file)
                    setCommandeLinkBtn(false)
                    break;
                case 'Client':
                    setClientLink(response.data.file)
                    setClientLinkBtn(false)
                    break;
                case 'StockCamion':
                    setStockCamionLink(response.data.file)
                    setStockCamionLinkBtn(false)
                    break;

                default:
                    break;
            }
            toast.success("Fichier est Prest !", GConf.TostSuucessGonf)
        })
    }

    const ClearDirectory = () => {
        axios.post(`${GConf.ApiLink}/tools/export/clear`, {
            tag: GConf.SystemTag,
        })
        .then(function (response) {
            console.log(response.data)
            toast.success("Server est Netoyer  !", GConf.TostSuucessGonf)
        })
    }

    /* ############################### Card ################################*/
    const StockCard = () =>{
        return(<>
            <div className='card card-body shadow-sm mb-4 border-div'>
               <h5>Sauvegarder le Stock </h5> 
               <p>
               </p> 
               <div className='text-end'>
                    <Button className='bg-info rounded-pill' onClick={() => ExportFlies( `${GConf.SystemTag}_article`,'Stock') }> <span className='bi bi-folder-symlink-fill'></span> Export</Button>
                    
                    <a href={`${GConf.ApiLink}/tools/export/download/${stockLink}` } style={{pointerEvents: stockLinkBtn ? 'none' :  ''}} target='c_blank'>
                        <Button className='bg-warning rounded-pill' disabled={stockLinkBtn}> <span className='bi bi-printer-fill'></span>  Telecharger Copie </Button>
                    </a> 
               </div>
            </div>
        </>)
    }
    const FacturesCard = () =>{
        return(<>
            <div className='card card-body shadow-sm mb-4 border-div'>
               <h5>Sauvegarder les Factures </h5> 
               <p>
               </p> 
               <div className='text-end'>
                    <Button className='bg-info rounded-pill' onClick={() => ExportFlies( 'factures','Factures') }> <span className='bi bi-folder-symlink-fill'></span> Export</Button>
                    
                    <a href={`${GConf.ApiLink}/tools/export/download/${factureLink}` } style={{pointerEvents: factureLinkBtn ? 'none' :  ''}} target='c_blank'>
                        <Button className='bg-warning rounded-pill' disabled={factureLinkBtn}> <span className='bi bi-printer-fill'></span>  Telecharger Copie </Button>
                    </a> 
               </div>
            </div>
        </>)
    }
    const ClientCard = () =>{
        return(<>
            <div className='card card-body shadow-sm mb-4 border-div'>
               <h5>Sauvegarder les Client </h5> 
               <p>
               </p> 
               <div className='text-end'>
                    <Button className='bg-info rounded-pill' onClick={() => ExportFlies( `system_clients`,'Client') }> <span className='bi bi-folder-symlink-fill'></span> Export</Button>
                    
                    <a href={`${GConf.ApiLink}/tools/export/download/${clientLink}` } style={{pointerEvents: clientLinkBtn ? 'none' :  ''}} target='c_blank'>
                        <Button className='bg-warning rounded-pill' disabled={clientLinkBtn}> <span className='bi bi-printer-fill'></span>  Telecharger Copie </Button>
                    </a> 
               </div>
            </div>
        </>)
    }
    const CamionStockCard = () =>{
        return(<>
            <div className='card card-body shadow-sm mb-4 border-div'>
               <h5>Sauvegarder Le Stock Camion </h5> 
               <p>
               </p> 
               <div className='text-end'>
                    <Button className='bg-info rounded-pill' onClick={() => ExportFlies( `${GConf.SystemTag}_camion_stock`,'StockCamion') }> <span className='bi bi-folder-symlink-fill'></span> Export</Button>
                    
                    <a href={`${GConf.ApiLink}/tools/export/download/${stockCamionLink}` } style={{pointerEvents: stockCamionLinkBtn ? 'none' :  ''}} target='c_blank'>
                        <Button className='bg-warning rounded-pill' disabled={stockCamionLinkBtn}> <span className='bi bi-printer-fill'></span>  Telecharger Copie </Button>
                    </a> 
               </div>
            </div>
        </>)
    }
    const CommandeCard = () =>{
        return(<>
            <div className='card card-body shadow-sm mb-4 border-div'>
               <h5>Sauvegarder les Commandes </h5> 
               <p>
               </p> 
               <div className='text-end'>
                    <Button className='bg-info rounded-pill' onClick={() => ExportFlies( `system_commande`,'Commande') }> <span className='bi bi-folder-symlink-fill'></span> Export</Button>
                    
                    <a href={`${GConf.ApiLink}/tools/export/download/${commandeLink}` } style={{pointerEvents: commandeLinkBtn ? 'none' :  ''}} target='c_blank'>
                        <Button className='bg-warning rounded-pill' disabled={commandeLinkBtn}> <span className='bi bi-printer-fill'></span>  Telecharger Copie </Button>
                    </a> 
               </div>
            </div>
        </>)
    }
    const ClearDirectoryCard = () =>{
        return(<>
            <div className='card card-body shadow-sm mb-4 border-div'>
               <h5>Nettoyage des ficher indeésirable sur le serveur </h5>  
               <div className='row'>
                    <div className='col-8 align-self-center'>
                        Totale des volume des ficher est : {fileSize / 1000000} MB
                    </div>
                    <div className='col-4 text-end align-self-center'>
                        <Button className='bg-danger text-white' onClick={() => ClearDirectory() }> nettoyer le serveur  </Button>
                    </div>
               </div>
            </div>
        </>)
    }
    return ( <>
    
        <br />
        <br />
        <div className='container'>
            <ClearDirectoryCard />
            <br />
            <div className='row'>
                    <div className='col-12'><StockCard /></div>
                    <div className='col-6'><CommandeCard /></div>
                    <div className='col-6'><FacturesCard /></div>
                    <div className='col-6'><ClientCard /></div>
                    <div className='col-6'><CamionStockCard /></div>
            </div>
        </div>  
    </> );
}

export default DataBaseBU;