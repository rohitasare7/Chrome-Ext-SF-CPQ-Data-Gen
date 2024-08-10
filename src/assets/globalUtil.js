// Get SF host domain suffix
export const extractValue = (url) => {
    const prodPattern = /https:\/\/([^.]+)\.(lightning\.force\.com|my\.salesforce\.com|vf\.force\.com|my\.site\.com)$/;
    const prodMatch = url.match(prodPattern);
    if (prodMatch) {
        return prodMatch[1];
    }

    const sandboxPattern = /https:\/\/([^.]+)\.sandbox\.(lightning\.force\.com|my\.salesforce\.com|vf\.force\.com|my\.site\.com)$/;
    const sandboxMatch = url.match(sandboxPattern);
    if (sandboxMatch) {
        return sandboxMatch[1];
    }

    const devPattern = /https:\/\/([^.]+)\.develop\.(lightning\.force\.com|my\.salesforce\.com|vf\.force\.com|my\.site\.com)$/;
    const devMatch = url.match(devPattern);
    if (devMatch) {
        return devMatch[1];
    }

    const trailblazePattern = /https:\/\/([^-]+)-([^.]+)\.trailblaze\.(lightning\.force\.com|my\.salesforce\.com|vf\.force\.com|my\.site\.com)$/;
    const trailblazeMatch = url.match(trailblazePattern);
    if (trailblazeMatch) {
        return trailblazeMatch[2];
    }

    return null;
}

// Get Org Suffix URL with VF Force
export const getOrgSuffixURL = (orgIdentifier, recId, type) => {
    switch (type) {
        case 'DataRaptor':
            return `https://${orgIdentifier}--vlocity-cmt.vf.force.com/apex/vlocity_cmt__drmapper?id=${recId}`;
        case 'IntegrationProcedure':
            return `https://${orgIdentifier}--vlocity-cmt.vf.force.com/apex/vlocity_cmt__integrationproceduredesigner?id=${recId}`;
        default:
            return null;
    }
};

export const getSalesforceURL = (orgIdentifier, sfHostURL, recId, type) => {
    const baseURL = `https://${sfHostURL}/lightning`;
    switch (type) {
        case 'OmniScript':
            return `${baseURL}/cmp/vlocity_cmt__OmniDesignerAuraWrapper?c__recordId=${recId}`;
        case 'FlexCard':
            return `${baseURL}/r/vlocity_cmt__VlocityCard__c/${recId}/view`;
        case 'IntegrationProcedure':
        case 'DataRaptor':
            return getOrgSuffixURL(orgIdentifier, recId, type);
        default:
            return null;
    }
};

import toast from "./toast";
export const addToast = (toastText, toastType) => {
    toast.add({
      message: {
        text: toastText,
        type: toastType ?? 'Success',
      },
    });
  }