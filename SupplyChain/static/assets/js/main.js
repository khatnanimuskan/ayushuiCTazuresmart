

document.addEventListener('DOMContentLoaded', _ => {
    $.get("https://newcelebal.azurewebsites.net/.auth/me", function(data) {
    console.log(data);
    document.getElementById("").innerHTML = data[0].user_claims[11].val;
    console.log(document.getElementById("").innerHTML = data[0].user_claims[11].val);
  })
  document.getElementById('form-div').style.visibility = 'visible'
  $('[data-toggle="tooltip"]').tooltip()
})

var app = new Vue({
  el: '#app',
  data: {
    message: 'hello!',
    configLoaded: false,
    showLoader: true,
		subSection: '',
		storageaccountnameerror: false,
    infoModal: {
      body: '',
      title: ''
    },
    pageInfo: {
      show: false,
      type: '',
      body: ''
    },
    userInput: ''
  },
  mounted() {
    this.getFormConfig()
  },
  updated() {
    $('[data-toggle="tooltip"]').tooltip()
  },
  methods: {
    getFormConfig() {
      var self = this

      function reqListener() {
        self.togglePageInfo(false)
        var data = JSON.parse(this.responseText)
        self.configLoaded = true
        self.showLoader = false
        self.userInput = data.formConfig
      }

      function reqError(err) {
        console.log('Fetch Error :-S', err)
        self.togglePageInfo(
          true,
          'danger',
          'There was an error loading data! Please check your connection and refresh the page.'
        )
      }

      var oReq = new XMLHttpRequest()
      oReq.onload = reqListener
      oReq.onerror = reqError
      oReq.open('get', '/get_data', true)
      oReq.send()
    },

    submitData() {
      console.log(this.userInput)
      var self = this

      function reqListener() {
        console.log(JSON.parse(this.responseText))
        self.togglePageInfo(false)
        self.toggleInfoModal(
          true,
          'Success',
          'Your request has been submitted successfully!'
        )
        self.getFormConfig()
      }

      function reqError(err) {
        console.log('Fetch Error :-S', err)
        self.togglePageInfo(
          true,
          'danger',
          'There was an error submitting form! Please check your connection and refresh the page.'
        )
      }

      var oReq = new XMLHttpRequest()
      oReq.onload = reqListener
      oReq.onerror = reqError
      oReq.open('post','/get_data', true)
      oReq.setRequestHeader('Content-Type', 'application/json')
      oReq.send(JSON.stringify(this.userInput))
    },

    hello() {
      console.log('hello')
    },

    generateId(sectionIndex, fieldIndex) {
      var self = this

      var oReq = new XMLHttpRequest()
      oReq.onload = function() {
        let resp = JSON.parse(this.responseText)
        self.userInput.sections[sectionIndex].sectionAttributes[
          fieldIndex
        ].value = resp.id
      }
      oReq.onerror = function(err) {
        console.log('Fetch Error :-S', err)
      }
      oReq.open('get',  '/uniqueid', true)
      oReq.setRequestHeader('Content-Type', 'application/json')
      oReq.send()
    },

    validateSubsection(fieldName, value) {
			var self = this
			self.storageaccountnameerror = false
      if (fieldName === 'StorageAccountName' && value.length > 0) {
				// console.log('blur evt fired')
        var oReq = new XMLHttpRequest()
        oReq.onload = function() {
					let resp = JSON.parse(this.responseText)
					// console.log(resp)
					if (resp.status === 'failed') self.storageaccountnameerror = true
					else if (resp.status === 'success') self.storageaccountnameerror = false
					else self.storageaccountnameerror = false
        }
        oReq.onerror = function(err) {
					console.log('Fetch Error :-S', err)
					self.storageaccountnameerror = false
        }
        oReq.open(
          'post', '/storage_verify',
          true
        )
        oReq.setRequestHeader('Content-Type', 'application/json')
        oReq.send(JSON.stringify(this.userInput))
			}
    },

    selectedSubsection(parentName, sectionIndex, subSectionKey) {
      let obj = this.userInput.sections[sectionIndex].sectionAttributes.find(
        el => el.internalName === parentName
      )
      if (obj)
        return obj.value === subSectionKey
          ? this.userInput.sections[sectionIndex].subsections.sections[
              subSectionKey
            ]
          : false
      return false
    },

    togglePageInfo(show, type = 'dark', body = '') {
      if (show) this.showLoader = false
      this.pageInfo.show = show
      this.pageInfo.type = type
      this.pageInfo.body = body
    },

    toggleInfoModal(show, title = '', body = '') {
      if (show) {
        $('#infoModal').modal('show')
        this.infoModal.title = title
        this.infoModal.body = body
      } else {
        $('#infoModal').modal('hide')
      }
    }
  }
})
