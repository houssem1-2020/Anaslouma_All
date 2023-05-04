import React from 'react'
import { BrowserRouter as Router, Routes,Route, Outlet} from "react-router-dom";




//System Commande
import CommandeTemp from '../../Printing/System/commande/commandes';

//System Stock
import ResumerArticle from '../../Printing/System/stock/stockResumerArticle';
import VenteArticle from '../../Printing/System/stock/stockVenteArticle';
import BonEntreSortie from '../../Printing/System/stock/stockBonES'

//System Facture
import FactureTemp from '../../Printing/System/facture/facture';
import FactureOfflineTemp from '../../Printing/System/facture/factureOffline'
import BonsLivTemp from '../../Printing/System/facture/factureBonLS';
import ResumerFacture from '../../Printing/System/facture/factureComptable'

//System Camion
import CamionVente from '../../Printing/System/camion/camionVente';
import CamionFacture from '../../Printing/System/camion/camionFacture';
import CamionFond from '../../Printing/System/camion/camionFond';
import CamionStock from '../../Printing/System/camion/camionStock';
import CamionStockArticle from '../../Printing/System/camion/camionStockArticle';
import CamionFondTemp from '../../Printing/System/camion/camionFondTemp';
import CamionFactureTemp from '../../Printing/System/camion/camionFacture';
import CamionRecetteList from '../../Printing/System/camion/camionRecetteList';
import CamionVenteArticles from '../../Printing/System/camion/camionVenteArticles';
import CamionBonsLivTemp from '../../Printing/System/camion/camionFondBonsLS';

//System Tools
import RecetteDepo from '../../Printing/System/tools/toolsRecette';
import PrintPrix from '../../Printing/System/tools/toolsPrintPrix';
import PrintStock from '../../Printing/System/tools/toolsPrintStock';

//Camion Facture
import FactureCamion from '../../Printing/Camion/factureCamion';
import CamionInventaireTemp from '../../Printing/System/camion/camionInventaireTemp';
import RecetteCamionTemp from '../../Printing/Camion/recetteCamion';
import Catalogueprint from '../../Printing/System/tools/catalogueprint';
import CommandeGroupBLS from '../../Printing/System/commande/camionBLS';
import CommandeGroupFacture from '../../Printing/System/commande/camionFacture';
import CommandeGroupResumer from '../../Printing/System/commande/camionResumer';
import CommandeGroupListe from '../../Printing/System/commande/camionListe';
import CommandeGroupListeCmd from '../../Printing/System/commande/commandeListe';

//Camion Stock
//Camion Vente
//Camion Recette





const PrintingRouter = () => (
        <Route path="Pr">
            <Route path="commande/:cid" element={<CommandeTemp />} />
            <Route path="commande/liste/:compte/:start/:end" element={<CommandeGroupListeCmd />} />

            <Route path="Stock">
                <Route path="resumer/:code/:s/:e" element={<ResumerArticle />} />
                <Route path="vente/:code/:s/:e" element={<VenteArticle />} />
                <Route path="bonE/:bonId" element={<BonEntreSortie genre='Entre' />} />
                <Route path="BonS/:bonId" element={<BonEntreSortie genre='Sortie' />} />
                <Route path="BonR/:bonId" element={<BonEntreSortie genre='Retour' />} />
            </Route>

            <Route path="Facture">
                <Route path="info/:fid" element={<FactureTemp />} />
                <Route path="offline/info/:fid" element={<FactureOfflineTemp />} />
                <Route path="bonL/:fid" element={<BonsLivTemp genre='Livraison' />} />
                <Route path="bonS/:fid" element={<BonsLivTemp genre='Sortie'/>} />
                <Route path="resumer/:s/:e" element={<ResumerFacture />} />
            </Route>
            
            <Route path="Camion">
                <Route path="Fonds/fondTemp/:fid" element={<CamionFondTemp />} />
                <Route path="Fonds/FondbonL/:fid/:chauff/:de/:vers" element={<CamionBonsLivTemp genre='Livraison'/>} />
                <Route path="Fonds/FondbonS/:fid/:chauff/:de/:vers" element={<CamionBonsLivTemp genre='Sortie'/>} />
                <Route path="Inventaire/:fid" element={<CamionInventaireTemp  />} />
                <Route path="info/factureTemp/:fid" element={<CamionFactureTemp />} />

                {/* Control */}
                <Route path="info/stock/:cid" element={<CamionStock />} />
                <Route path="info/stock-z/:cid" element={<CamionStock zero />} />
                <Route path="info/stock/article/:cid/:aid" element={<CamionStockArticle />} />
                <Route path="info/vente/factures/:cid/:d" element={<CamionVente />} />
                <Route path="info/vente/articles/:cid/:d" element={<CamionVenteArticles />} />
                <Route path="info/vente/recette/:cid/:s/:e" element={<CamionRecetteList />} />
                <Route path="info/fond/:cid/:s/:e" element={<CamionFond />} />

                {/* Commandes */}
                <Route path="commandes/BL/:CID/:jour" exact element={<CommandeGroupBLS  genre='Livraison' />} />
                <Route path="commandes/BS/:CID/:jour" exact element={<CommandeGroupBLS  genre='Sortie' />} />
                <Route path="commandes/Facture/:CID/:jour" exact element={<CommandeGroupFacture />} />
                <Route path="commandes/Liste/:CID/:jour" exact element={<CommandeGroupListe />} />
                <Route path="commandes/Resumer/:CID/:jour" exact element={<CommandeGroupResumer />} />

            </Route>

            <Route path="Tools">
                <Route path="recette/:s/:e" element={<RecetteDepo />} />
                <Route path="print/prix/:g" element={<PrintPrix />} />
                <Route path="print/stock/:g" element={<PrintStock />} />
                <Route path="catalogue/:tagNum" element={<Catalogueprint />} />
            </Route>
            
            <Route path="CamSys">
                <Route path="facture/:fid" element={<FactureCamion />} />
                <Route path="stock" element={<PrintStock />} />
                <Route path="stock/article" element={<PrintStock />} />
                <Route path="recette" element={<RecetteCamionTemp />} />
            </Route>
        </Route> 
)

export default PrintingRouter 