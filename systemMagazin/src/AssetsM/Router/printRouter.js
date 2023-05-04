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
import CamionVente from '../../Printing/System/caisse/camionVente';
import CamionFacture from '../../Printing/System/caisse/camionFacture';
import CamionFond from '../../Printing/System/caisse/camionFond';
import CamionStock from '../../Printing/System/caisse/camionStock';
import CamionStockArticle from '../../Printing/System/caisse/camionStockArticle';
import CaisseFacture from '../../Printing/System/caisse/caisseFacture';
import CamionFactureTemp from '../../Printing/System/caisse/camionFacture';
import CamionRecetteList from '../../Printing/System/caisse/camionRecetteList';
import CamionVenteArticles from '../../Printing/System/caisse/camionVenteArticles';
import CamionBonsLivTemp from '../../Printing/System/caisse/camionFondBonsLS';

//System Tools
import RecetteDepo from '../../Printing/System/tools/toolsRecette';
import PrintPrix from '../../Printing/System/tools/toolsPrintPrix';
import PrintStock from '../../Printing/System/tools/toolsPrintStock';

//Camion Facture
import FactureCamion from '../../Printing/Camion/factureCamion';
import CamionInventaireTemp from '../../Printing/System/caisse/camionInventaireTemp';
import RecetteCamionTemp from '../../Printing/Camion/recetteCamion';
import Catalogueprint from '../../Printing/System/tools/catalogueprint';
import CommandeGroupBLS from '../../Printing/System/commande/camionBLS';
import CommandeGroupFacture from '../../Printing/System/commande/camionFacture';
import CommandeGroupResumer from '../../Printing/System/commande/camionResumer';
import OpenCaisse from '../../Printing/Camion/openCaisse';
import PrintPrixLarge from '../../Printing/System/tools/toolsPrintPrixLarge';
import PrintPrixMoyenne from '../../Printing/System/tools/toolsPrintPrixMoyenne';

//Camion Stock
//Camion Vente
//Camion Recette





const PrintingRouter = () => (
        <Route path="Pr">
            <Route path="commande/:cid" element={<CommandeTemp />} />

            <Route path="Stock">
                <Route path="resumer/:code/:s/:e" element={<ResumerArticle />} />
                <Route path="vente/:code/:s/:e" element={<VenteArticle />} />
                <Route path="bonE/:bonId" element={<BonEntreSortie genre='Entre' />} />
                <Route path="BonS/:bonId" element={<BonEntreSortie genre='Sortie' />} />
            </Route>

            <Route path="Facture">
                <Route path="info/:fid/:client" element={<FactureTemp />} />
                <Route path="offline/info/:fid" element={<FactureOfflineTemp />} />
                <Route path="bonL/:fid" element={<BonsLivTemp genre='Livraison' />} />
                <Route path="bonS/:fid" element={<BonsLivTemp genre='Sortie'/>} />
                <Route path="resumer/:s/:e" element={<ResumerFacture />} />
            </Route>
            
            <Route path="caisse">
                <Route path="Fonds/fondTemp/:fid" element={<CaisseFacture />} />
            </Route>

            <Route path="fournisseur">
                <Route path="facture/:genre/:FID" element={<CamionFacture />} />
            </Route>

            <Route path="Tools">
                <Route path="recette/:s/:e" element={<RecetteDepo />} />
                <Route path="print/prix/normale" element={<PrintPrix />} />
                <Route path="print/prix/moyenne" element={<PrintPrixMoyenne />} />
                <Route path="print/prix/large" element={<PrintPrixLarge />} />
                <Route path="print/stock/:g" element={<PrintStock />} />
                <Route path="catalogue/:tagNum" element={<Catalogueprint />} />
            </Route>
            
            <Route path="caisse">
                <Route path="facture/:fid" element={<FactureCamion />} />
                <Route path="open" element={<OpenCaisse />} />
                <Route path="recette" element={<RecetteCamionTemp />} />
            </Route>
        </Route> 
)

export default PrintingRouter 