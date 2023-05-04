import React, { useState } from 'react';
import { Grid, _ } from "gridjs-react";
import "gridjs/dist/theme/mermaid.css";
import GConf from '../../AssetsM/generalConf';

function TableGrid(props) {
    const handlePageChange = (grid) => {
        //setPage(grid.state.page);
        //localStorage.setItem(`${GConf.SystemTag}_GridJs`, grid.state.page);
        console.log('work')
    }

    const GetPageNumber = (page) => {
        if (page == 'facture') {
            return 5
        } else {
            return 2
        }
    };

    return ( <>
            <Grid   
                data={props.tableData}
                columns={props.columns}
                search = {true}
                // search={{
                //     //keyword : props.page ? GetPageNumber(props.page) : '' ,
                //     onReady : (query) => {
                //         //setSearchText(query);
                //         console.log(`Search text changed: ${query}`);
                //       }
                //   }}
                onSearch={() => handlePageChange()}
                resizable = {true}
                sort = {true}                
                pagination= {{
                    //page : props.page ? GetPageNumber(props.page) : 0 ,
                    enabled: true,
                    limit: 15,
                    //summary: false,
                    buttonsCount: 5,
                    
                }}
                language={{
                    search : {
                        placeholder :'🔍 Recherche ...' ,
                        input: 'searchText',
                        },
                    pagination: {
                            previous: ' ',
                            next: ' ',
                            showing: ' ',
                            of: 'de',
                            to: 'à',
                            results: 'Resultat',
                    },
                    noRecordsFound: '🚩🚩🚩  Pas De Résultat  🚩🚩🚩',
                        
                                
                }}
                className= {{
                    search:'w-100-seach-input',
                    table:'rounded-0 border-2  w-100-seach-input',
                    paginationButtonNext:'bi bi-caret-right-fill text-success',
                    paginationButtonPrev :'bi bi-caret-left-fill text-danger' ,
                    container: 'card card-body border-div'
                }}
                style= {{
                    table: {
                        borderRadius: '0px !important',
                    },
                    th:{
                        padding:'15px', border:'none', borderBottom:'1px solid #7f7f7f'
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