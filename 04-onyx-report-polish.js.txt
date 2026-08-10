/* Onyx Data Intelligence — preserved source block. */

/* Objectif ↔ données : contrôle de couverture avant narration métier */
function objectiveFeasibility(){
  const o=$("objective")?.value||"general", b=state.business||{}, has=k=>state.columns?.some(c=>state.roleKeys[c]===k), names=(state.columns||[]).map(normalizeSemanticName).join(" ");
  const checks={
    general:[[true,"structure de données"]],
    performance:[[has("result")||has("rate")||has("score"),"résultat/taux/score"],[has("target"),"objectif/cible"],[!!b.primaryDate,"date"]],
    finance:[[has("revenue")||has("amount"),"revenu ou montant"],[has("cost"),"coût/dépense"],[!!b.primaryDate,"date"]],
    operations:[[has("volume"),"volume"],[has("duration")||has("status"),"délai ou statut"],[!!b.primaryDate,"date"]],
    marketing:[[has("revenue")||/vente|sales|lead|conversion/.test(names),"revenu/vente/conversion"],[has("entity")||has("category"),"client/produit/canal"],[!!b.primaryDate,"date"]],
    sales:[[has("revenue"),"revenu/CA"],[has("volume"),"volume/quantité"],[has("entity")||has("category"),"client/produit" ]],
    customer:[[has("identifier")||/client|customer/.test(names),"client/identifiant"],[has("score")||/satisfaction|plainte|reclamation|churn|retention/.test(names),"satisfaction/retention"],[!!b.primaryDate,"date"]],
    hr:[[/employe|employee|matricule/.test(names),"identifiant employé"],[/departement|department|service|equipe/.test(names),"unité RH"],[has("amount")||has("cost")||has("score")||has("duration"),"coût/performance/durée"]],
    inventory:[[/stock|inventory|sku|article|produit/.test(names),"stock/produit"],[has("volume")||has("amount")||has("cost"),"quantité/valeur"],[/fournisseur|supplier|livraison|delivery/.test(names),"fournisseur/logistique"]],
    projects:[[/projet|project|programme|program/.test(names)||has("entity"),"projet/programme"],[has("target")||has("result"),"cible/résultat"],[has("cost")||has("amount"),"budget/coût"]],
    risk:[[has("score")||/risque|risk|fraude|fraud|incident|defaut|default/.test(names),"risque/incident/score"],[!!b.primaryId,"identifiant"],[!!b.primaryDate,"date"]],
    quality:[[true,"profil de qualité"],[!!state.quality,"diagnostic qualité"]],
    impact:[[has("target")||has("result"),"cible/résultat"],[has("volume")||/beneficiaire|beneficiary/.test(names),"bénéficiaires/volume"],[has("cost")||has("amount"),"ressources/coûts"]],
    forecast:[[!!b.primaryDate,"date"],[!!(b.primaryRevenue||b.primaryVolume||b.primaryFinancial||numericRoleColumn(["result","amount"])),"mesure numérique"],[state.timeSeries?.length>0,"historique exploitable"]]
  };
  const c=checks[o]||checks.general, ok=c.filter(x=>!!x[0]).length, score=Math.round(100*ok/Math.max(1,c.length)), missing=c.filter(x=>!x[0]).map(x=>x[1]);
  return{score,missing,label:score>=80?"Couverture élevée":score>=55?"Couverture partielle":"Couverture insuffisante"}
}
const _onyxRenderAudienceBase=renderAudienceIntelligence;
renderAudienceIntelligence=function(){
  _onyxRenderAudienceBase();
  const f=objectiveFeasibility(),ctx=activeReportContext(),badge=$("domainBadge");
  if(badge)badge.textContent=`Expertise : ${domainLabel(ctx.domain)} · ${f.label} ${f.score}%`;
  if(f.missing.length&&$("omissionPolicy"))$("omissionPolicy").textContent=`${ctx.audience.omit} Pour l’objectif choisi, les éléments non étayés (${f.missing.join(", ")}) seront omis plutôt que simulés.`;
};
const _onyxBuildRecommendationsBase=buildRecommendations;
buildRecommendations=function(){
  let out=_onyxBuildRecommendationsBase(), f=objectiveFeasibility(), ctx=activeReportContext();
  if(f.score<65&&ctx.objectiveKey!=="general"){
    const r={priority:"Prérequis analytique",title:`Renforcer la couverture pour l’objectif « ${objectiveLabel()} »`,evidence:`La couverture des données nécessaires à cet objectif est estimée à ${f.score} %.`,cause:`Variables manquantes : ${f.missing.join(", ")}.`,consequence:"Les conclusions spécialisées seraient incomplètes si ces dimensions étaient simulées.",action:`Compléter ou relier les données nécessaires (${f.missing.join(", ")}) ; en attendant, limiter le rapport aux constats réellement observables.`,description:`La couverture des données nécessaires à cet objectif est estimée à ${f.score} %. Compléter ${f.missing.join(", ")}.`,impact:5,effort:3,horizon:"Selon disponibilité des sources",owner:"Data owner / Responsable métier",metric:"Couverture des variables requises",expertise:domainLabel(ctx.domain),score:20};
    out=[r,...out.filter(x=>x.title!==r.title)];
  }
  const max=Math.max(3,Math.round((ctx.audience.maxRecommendations||7)*(ctx.depth.recFactor||1)));
  return out.slice(0,max);
};
renderAudienceIntelligence();
