import Dashboard from "views/Dashboard.js";
import Notifications from "views/Notifications.js";
import Programme from "views/Programme/Programme.js";
import Icons from "views/Icons.js";
import Typography from "views/Typography.js";
import TableList from "views/Tables.js";
import Maps from "views/Map.js";
import UserPage from "views/Chat/User.js";
import UpgradeToPro from "views/Upgrade.js";
import UsersList from "views/Chat/UsersList.js";
import ActionImpcatee from "views/ActionImpact/ActionImpcatee";
import Phase from "./views/Phase/Phase.js";
import ListeTaches from "./views/Tache/ListeTaches.js";
import Attachement from "views/attachement/Attachement";
import AttachementDetails from "views/attachement/AttachementDetails";
import RealisationList from "views/Realisation/realisationList.js";
import ComposantProgramme from "views/Programme/ComposantProgramme.js";
import DetailActionImpact from "views/ActionImpact/DetailActionImpact";
import DetailTach from"views/Tache/DetailTach.js";
import DetailleImpct from "views/Etude/DetailleImpct.js";
import ActionProgramme from"views/ActionProgramme/ActionProgramme.js"
import Marche from "views/Marche/Marche.js";
import ListEntreprise from "views/Entreprise/ListEntreprise.js";
import Avenant from "views/Avenants/Avenant.js";
import PvReception from "views/Paiment/PvReception.js";
import ActionMarche from "views/Marche/ActionMarche.js";
import Asf from "views/Paiment/Asf.js";
import AllActionImpactee from'views/ActionImpact/AllActionImpactee.js'
import ComposantRealisation from "views/ActionImpact/ComposantRealisation.js";
import Cpt from"views/Cpt/Cpt.js"
import ComposantEtude from "views/Etude/ComposantEtude.js";
import ProcesVerbalpro from "views/EtudePaiment/ProcesVerbalpro.js";
import DecomptSituation from "views/EtudePaiment/DecomptSituation.js";
import PlanAction from"views/PlanAction/PlanAction.js"

var routes = [
  {
    path: "/dashboard/:idprog",
    name: "tableau de bord",
    icon: "nc-icon nc-bank",
    component: <Dashboard />,
    layout: "/admin",
    roles: ["ADMIN", "UTILISATEUR"],
    display: false,
  },
  {
    path: "/PlanAction",
    name: "Plan d'action",
    icon: "nc-icon nc-paper",
    component: <PlanAction/>,
    layout: "/admin",
    roles: ["ADMIN", "UTILISATEUR"],
    display: true,
  },
  {
    path: "/programme",
    name: "Programme",
    icon: "nc-icon nc-paper",
    component: <Programme/>,
    layout: "/admin",
    roles: ["ADMIN", "UTILISATEUR"],
    display: true,
  },
  {
    path: "/marche/:idprog",
    name: "Marche",
    icon: "nc-icon nc-paper",
    component: <Marche />,
    layout: "/admin",
    roles: ["ADMIN"],
    display: false,
  },
  {
    path: "/actionmarche/:idmarche/:nummarche/:idprog",
    name: "Marche",
    icon: "nc-icon nc-paper",
    component: <ActionMarche/>,
    layout: "/admin",
    roles: ["ADMIN"],
    display: false,
  },
  {
    path: "/avenant/:idprog/:idmarche/:num_marche",
    name: "Avenant",
    icon: "nc-icon nc-paper",
    component: <Avenant />,
    layout: "/admin",
    roles: ["ADMIN"],
    display: false,
  },
  {
    path: "/cpt/:idmarche/:idprog",
    name: "Avenant",
    icon: "nc-icon nc-paper",
    component: <Cpt />,
    layout: "/admin",
    roles: ["ADMIN"],
    display: false,
  },
  {
    path: "/entreprise/:idmarche/:idprog/:nummarche",
    name: "entreprise",
    icon: "nc-icon nc-paper",
    component: <ListEntreprise />,
    layout: "/admin",
    roles: ["ADMIN", "UTILISATEUR"],
    display: false,
  },
  {
    path: "/allimp/:idMarche/:idprog/:nummarche/:type",
    name: "entreprise",
    icon: "nc-icon nc-paper",
    component: <AllActionImpactee />,
    layout: "/admin",
    roles: ["ADMIN", "UTILISATEUR"],
    display: false,
  },
  {
    path: "/ComposantProgramme/:idprog",
    name: "Composant d'un programme",
    icon: "nc-icon nc-paper",
    component: <ComposantProgramme />,
    layout: "/admin",
    roles: ["ADMIN", "UTILISATEUR"],
    display: false,
  },
  {
    path: "/Composantrealisation/:idprog",
    name: "Composant",
    icon: "nc-icon nc-paper",
    component: <ComposantRealisation />,
    layout: "/admin",
    roles: ["ADMIN", "UTILISATEUR"],
    display: false,
  },
  {
    path: "/ComposantEtude/:idprog",
    name: "Composant Etude",
    icon: "nc-icon nc-paper",
    component: <ComposantEtude/>,
    layout: "/admin",
    roles: ["ADMIN", "UTILISATEUR"],
    display: false,
  },
  {
    path: "/ProcesVerbalpro/:idprog/:type",
    name: "Composant Etude",
    icon: "nc-icon nc-paper",
    component: <ProcesVerbalpro/>,
    layout: "/admin",
    roles: ["ADMIN", "UTILISATEUR"],
    display: false,
  },
  {
    path: "/DecomptSituation/:idprog/:type",
    name: "Paiment Etude",
    icon: "nc-icon nc-paper",
    component: <DecomptSituation/>,
    layout: "/admin",
    roles: ["ADMIN", "UTILISATEUR"],
    display: false,
  },
  {
    path: "/PvReception/:idprog",
    name: "pv reception",
    icon: "nc-icon nc-paper",
    component: <PvReception/>,
    layout: "/admin",
    roles: ["ADMIN", "UTILISATEUR"],
    display: false,
  },
  {
    path: "/Asf/:idprog/:type",
    name: "Composant Paiment",
    icon: "nc-icon nc-paper",
    component: <Asf/>,
    layout: "/admin",
    roles: ["ADMIN", "UTILISATEUR"],
    display: false,
  },
  {
    path: "/ActionImp/:idprog/:type",
    name: "ActionImpct",
    icon: "nc-icon nc-paper",
    component: <ActionImpcatee />,
    layout: "/admin",
    roles: ["ADMIN", "UTILISATEUR"],
    display: false,
  },
  {
    path: "/ActionProg",
    name: "Bibiolthèque des action",
    icon: "nc-icon nc-paper",
    component: <ActionProgramme />,
    layout: "/admin",
    roles: ["ADMIN", "UTILISATEUR"],
    display: true,
  },
  {
    path: "/DetailActionImp/:idimpct/:idprog/:action/:idmarche/:nummarche",
    name: "DetailActionImpct",
    icon: "nc-icon nc-paper",
    component: <DetailActionImpact />,
    layout: "/admin",
    roles: ["ADMIN", "UTILISATEUR"],
    display: false,
  },
  {
    path: "/DetailEtude/:idimpct/:id",
    name: "DetailActionImpct",
    icon: "nc-icon nc-paper",
    component: <DetailleImpct />,
    layout: "/admin",
    roles: ["ADMIN", "UTILISATEUR"],
    display: false,
  },
  {
    path: "/attachement/:idprog/:type",
    name: "attachement",
    icon: "nc-icon nc-bank",
    component: <Attachement />,
    layout: "/admin",
    roles: ["ADMIN", "UTILISATEUR"],
    display: false,
  },
  {
    path: "/DetailTach/:idtach",
    name: "DetailTach",
    icon: "nc-icon nc-bank",
    component: <DetailTach />,
    layout: "/admin",
    roles: ["ADMIN", "UTILISATEUR"],
    display: false,
  },
  {
    path: "/attachementDetails/:id_attachement",
    name: "_attachement",
    icon: "nc-icon nc-bank",
    component: <AttachementDetails />,
    layout: "/admin",
    roles: ["ADMIN", "UTILISATEUR"],
    display: false,
  },
  {
    path: "/phase/:id_action_impactee",
    name: "Phase",
    icon: "nc-icon nc-tile-56",
    component: <Phase />,
    layout: "/admin",
    roles: ["ADMIN"],
    display: false,
  },
  {
    path: "/Liste-Taches",
    name: "Liste Taches",
    icon: "nc-icon nc-paper",
    component: <ListeTaches />,
    layout: "/admin",
    roles: ["ADMIN", "UTILISATEUR"],
    display: false,
  },
  {
    path: "/RealisationList/:id_tache",
    name: "Realisation",
    icon: "nc-icon nc-check-2",
    component: <RealisationList />,
    layout: "/admin",
    roles: ["ADMIN", "UTILISATEUR"],
  },
  // {

  //   name: "programme",
  //   icon: "nc-icon nc-paper",
  //   roles:['ADMIN','UTILISATEUR'],

  //   submenu: [
  //     {
  //       path: "/programme",
  //       name: "nouveau programme",
  //       icon: "nc-icon nc-simple-add",
  //       layout: "/admin",
  //       component: <Programme/>,
  //       roles: ['ADMIN', 'UTILISATEUR']
  //     }
  //   ]
  // },
  // {
  //   path: "/icons",
  //   name: "Icons",
  //   icon: "nc-icon nc-diamond",
  //   component: <Icons />,
  //   layout: "/admin",
  //   roles: ["ADMIN", "UTILISATEUR"],
  //   display: true,
  // },
  // {
  //   path: "/maps",
  //   name: "Maps",
  //   icon: "nc-icon nc-pin-3",
  //   component: <Maps />,
  //   layout: "/admin",
  //   roles:['ADMIN','UTILISATEUR']
  // },
   {
    path: "/notifications",
    name: "Notifications",
    icon: "nc-icon nc-bell-55",
    component: <Notifications />,
    layout: "/admin",
  },
  {
    path: "/user-page",
    name: "Messagerie",
    icon: "nc-icon nc-chat-33",
    component: <UserPage />,
    layout: "/admin",
    roles: ["ADMIN", "UTILISATEUR"],
    display: true,
  },
  {
    path: "/UsersList",
    name: "UTILISATEURS",
    icon: "nc-icon nc-single-02",
    component: <UsersList />,
    layout: "/admin",
    roles: ["ADMIN"],
    display: true,
  },
];
export default routes;
