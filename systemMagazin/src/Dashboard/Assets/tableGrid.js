import React from 'react';
import { Grid, _ } from "gridjs-react";
import "gridjs/dist/theme/mermaid.css";
import InputLinks from '../../Caisse/Assets/linksData';

function TableGrid(props) {
    return ( <>
            <Grid   
                data={props.tableData}
                columns={props.columns}
                search = {true}
                resizable = {true}
                sort = {true}                
                pagination= {{
                    enabled: true,
                    limit: 15,
                }}
                language={{
                    search : {
                        placeholder :'🔍 Recherche ...' ,
                        },
                    pagination: {
                            previous: ' ',
                            next: ' ',
                            limit: 15,
                            showing: ' ',
                            of: 'de',
                            to: 'à',
                            results: 'Resultat',
                    },
                    noRecordsFound: '🚩🚩🚩  Pas De Résultat  🚩🚩🚩',
                        
                                
                }}
                className= {{
                    search:'w-100-seach-input shadow-sm',
                    table:'rounded-0 border-2  w-100-seach-input',
                    paginationButtonNext:'bi bi-caret-right-fill text-success',
                    paginationButtonPrev :'bi bi-caret-left-fill text-danger' ,
                    container: InputLinks.themeMode == 'dark' && props.dark ? 'card card-body border-div shadow-sm mb-2 bg-dark' : 'card card-body border-div shadow-sm mb-2',
                    td: InputLinks.themeMode == 'dark' && props.dark ? 'bg-dark-theme-3 text-white border-dark' : '' ,
                    thead : InputLinks.themeMode == 'dark' && props.dark ? 'bg-dark text-white border-dark' : '' ,
                    footer : InputLinks.themeMode == 'dark' && props.dark ? 'bg-dark-theme-3 text-white border-dark' : '' ,
                }}
                style= {{
                    table: {
                        borderRadius: '0px !important',
                    },
                    th:{
                        padding:'15px', border:'none', borderBottom:'1px solid #7f7f7f', 
                    },
                    td:{
                        padding:'7px', paddingLeft:'10px', border:'none', borderBottom:'1px solid #e8e8e8'
                    },
                    container:{
                        padding : '18px'
                    },
                    footer:{
                        border:'none'
                    }
                }}     
            />
    </> );
}

export default TableGrid;