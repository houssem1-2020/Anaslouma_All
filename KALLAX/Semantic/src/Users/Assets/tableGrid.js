import React from 'react';
import { Grid, _ } from "gridjs-react";

function TableGrid(props) {
    return ( <>
     <div className='table-responsive'>
            <Grid   
                data={props.tableData}
                columns={props.columns}
                search = {true}
                sort = {true}
                pagination = {true}
                resizable = {true} 
                language={{
                    search : {
                        placeholder :'🔍 Recherche ...' ,
                        },
                    pagination: {
                            previous: ' ',
                            next: ' ',
                            limit: 2,
                            showing: ' ',
                            of: 'de',
                            to: 'à',
                            results: 'Resultat',
                    },
                    noRecordsFound: '🚩🚩🚩  Pas De Résultat  🚩🚩🚩',
                        
                                
                }}
                className= {{
                    search:'w-100-seach-input shadow-sm',
                    table:`rounded-0    `,
                    paginationButtonNext:'bi bi-caret-right-fill text-success',
                    paginationButtonPrev :'bi bi-caret-left-fill text-danger' ,
                    container: ' card-body border-div  mb-2'
                }}
                style= {{
                    table: {
                        borderRadius: '20px !important'
                    },
                    th:{
                        padding:'15px', border:'none', borderBottom:'1px solid #7f7f7f' 
                    },
                    td:{
                        padding:'7px', paddingLeft:'10px', border:'none', whiteSpace: 'nowrap', borderBottom:'1px solid #e8e8e8'
                    },
                }}     
            />
            </div>
    </> );
}

export default TableGrid;