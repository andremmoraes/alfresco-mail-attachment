var MailAttachment = {};
MailAttachment.Actions = {};

(function() {
	/**
	 * Alfresco Slingshot aliases
	 */
	var $html = Alfresco.util.encodeHTML, $combine = Alfresco.util.combinePaths, $siteURL = Alfresco.util.siteURL, $isValueSet = Alfresco.util.isValueSet;

	function createIconStyle() {
		var styleText = '/* This style is added as part of the MailAttachment connection extension. */';
		styleText += '\n.toolbar .onActionMailAttachment { background-image: url(/share/res/resources/mail-attachment-share/documentlibrary/actions/send-attachment-icon-16.png); }';

		var style = document.createElement('style');
		style.type = 'text/css';
		if (style.styleSheet){
			style.styleSheet.cssText = styleText;
		} else {
			style.appendChild(document.createTextNode(styleText));
		}
		document.getElementsByTagName('head')[0].appendChild(style);
	}

	createIconStyle();

	MailAttachment.Actions.prototype = {
			/**
			 * @param record array of nodes actioned upon
			 */
			onActionMailAttachment : function _onActionMailAttachment(records) {
				var owner = {
						className: 'onActionMailAttachment'
				};
				
				var actionUrl = Alfresco.constants.PROXY_URI + "api/mail-with-attachment/send";
				var refs = [];
				for (i = 0; i < records.length; i++) {
					refs.push(records[i].nodeRef);
				}
				
				this.modules.sendEmail = new Alfresco.module.SimpleDialog(this.id).setOptions(
				         {
				            width: "30em",
				            templateUrl: Alfresco.constants.URL_SERVICECONTEXT + "forms/send-mail",
				            templateRequestParams: {
				            	attachmentRefs: refs
				            },
				            actionUrl: actionUrl,
				            doBeforeDialogShow:
				              {
				                 fn: function(formsRuntime, emailDialogObject){
				                   var dialog = this.id;
				                   this.form.submitElements[0].set('label','Send');
				                   var dialogHeader = Dom.get(dialog + '-dialogTitle');
				                   dialogHeader.innerHTML = this.msg("send-mail.doclib.action.sendAsEmail.label");
				                   this.form.setSubmitAsJSON(false);
				                 },
				                 obj: null,
				                 scope: null
				              },
				            //firstFocus: this.id + "-sendEmail-type",
				            onSuccess:
				            {
				               fn: function dlA_onActionMailAttachment_success(response)
				               {
				                  Alfresco.util.PopupManager.displayMessage(
				                  {
				                     text: this.msg("send-mail.msg.success")
				                  });
				               },
				               scope: this
				            },
				            onFailure:
				            {
				               fn: function dlA_onActionMailAttachment_failure(response)
				               {
				                  Alfresco.util.PopupManager.displayMessage(
				                  {
				                     text: this.msg("send-mail.msg.failure")
				                  });
				               },
				               scope: this
				            }
				         });
				
				this.modules.sendEmail.show();
			}
	};
})();

(function() {
	if (Alfresco.DocumentList) {
		YAHOO.lang.augmentProto(Alfresco.DocumentList, MailAttachment.Actions);
	}

	if (Alfresco.DocListToolbar) {
		YAHOO.lang.augmentProto(Alfresco.DocListToolbar, MailAttachment.Actions);
	}

	if (Alfresco.DocumentActions) {
		YAHOO.lang.augmentProto(Alfresco.DocumentActions, MailAttachment.Actions);
	}

	if (Alfresco.FolderActions) {
		YAHOO.lang.augmentProto(Alfresco.FolderActions, MailAttachment.Actions);
	}

	if (Alfresco.doclib.Actions) {
		YAHOO.lang.augmentProto(Alfresco.doclib.Actions, MailAttachment.Actions);
	}

	if (Alfresco.doclib.FolderActions) {
		YAHOO.lang.augmentProto(Alfresco.doclib.FolderActions, MailAttachment.Actions);
	}
})();