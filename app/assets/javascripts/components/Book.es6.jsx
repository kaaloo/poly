Book = React.createClass( {

  getInitialState: function() {
    return {
      phrasePairs: this.props.initialPhrasePairs,
      isEditingBook: false,
      book: this.props.initialBook,
      originalTitle:this.props.initialBook.title
    }
  },

  onSourcePhraseSubmit: function(sourcePhrase) {
    var newPhrasePair = {
      source_phrase: sourcePhrase,
    };
    var newPhrasePairs = this.state.phrasePairs;
    newPhrasePairs.push(newPhrasePair);
    this.setState({
      phrasePairs: newPhrasePairs
    })
  },

  onTargetPhraseSubmit: function(targetPhrase) {
    var newPhrasePairs = this.state.phrasePairs;
    var newPhrasePair = newPhrasePairs[newPhrasePairs.length - 1]
    newPhrasePair.target_phrase = targetPhrase;
    this.setState({
      phrasePairs: newPhrasePairs
    })
    this.saveNewPhrasePair(newPhrasePair);
  },

  saveNewPhrasePair: function(phrasePair) {
    $.ajax({
      url: "/phrase_pairs",
      type: "POST",
      data: {
        book_id: this.state.book.id,
        phrase_pair: phrasePair
      },
      success: function(phrasePair) {
        var newPhrasePairs = this.state.phrasePairs;
        newPhrasePairs.splice(this.state.phrasePairs.length -1, 1, phrasePair.phrase_pair)
        this.setState({
          phrasePairs: newPhrasePairs
        })
      }.bind(this),
      error: function() {
        console.log('Error: Save action failed')
      }
    })
  },

  onDeleteBookClick: function() {
    if(window.confirm("Are you sure you want to delete this book?")) {
      $.ajax({
        url: '/books/' + this.state.book.id,
        type: 'DELETE',
        success: function() {
          window.location.href = '/';
        }
      })
    }
  },

  onSaveBookClick: function() {
    $.ajax({
      url: '/books/' + this.state.book.id,
      type: "PUT",
      data: { book: this.state.book },
      success: function() {
        this.toggleEditingBookState();
      }.bind(this),
      error: function() {
        alert('something went wrong')
      }
    })
  },

  toggleEditingBookState: function() {
    this.setState({
      isEditingBook: !this.state.isEditingBook
    });
  },

  onInputChange: function(e) {
    var newBook = this.state.book;
    var newState = this.state;
    newBook[e.target.name] = e.target.value;
    newState.book = newBook;
    this.setState(newState);
  },

  onSearchBook: function() {
    alert("Searching is coming soon!")
  },

  onFavoriteBook: function() {
    alert("Favoriting is coming soon!")
  },


  bookIsOwnedByCurrentUser: function() {
    if (this.props.currentUser) {
      return this.props.initialBook.user_id == this.props.currentUser.id
    }
  },

  renderBookMenu: function() {
    if (this.bookIsOwnedByCurrentUser()) {
      if (this.state.isEditingBook) {
        return (
          <div className="menu saving">
            <button title="Save" onClick={this.onSaveBookClick} className="icon">
              <img src={this.props.save}/>
            </button>
            <button title="Cancel" onClick={this.toggleEditingBookState} className="close icon">
              <img src={this.props.close}/>
            </button>
          </div>
        );
      } else {
        return (
          <div className="menu">
            <button title="Menu" className="more icon">
              <img src={this.props.menu}/>
            </button>
            <button title="Edit" onClick={this.toggleEditingBookState} className="icon">
              <img src={this.props.edit}/>
            </button>
            <button title="Delete" onClick={this.onDeleteBookClick} className="icon">
              <img src={this.props.delete}/>
            </button>
          </div>
        );
      }
    }
  },

  renderTitle: function() {
     if (this.state.isEditingBook) {
      return <input name="title" className="title new isEditing" onChange={this.onInputChange} value={this.state.book.title} />;
    } else {
       return <h1>{this.state.book.title}</h1>;
    }
  },

  renderAuthor: function() {

    let users = this.props.users
    let authorName = ""
    for (var i = users.length - 1; i >= 0; i--) {
      if(this.props.initialBook.user_id == users[i].id) {
        authorName = users[i].username
      }
    }
    if (this.state.isEditingBook) {
      return (
        <p className="author">{authorName}</p>
      )
    } else {
      return (
        <a href={"/accounts/" + this.state.book.user_id} className="author">{authorName}</a>
      )
    }
  },

  renderDescription: function() {
     if (this.state.isEditingBook) {
      return <textarea rows="4" className="description new isEditing" name="description" onChange={this.onInputChange} value={this.state.book.description} />;
    } else {
       return <p className="description">{this.state.book.description}</p>;
    }
  },

   renderSourceLanguage: function() {
     if (this.state.isEditingBook) {
      return <input className="new isEditing" name="source_language" onChange={this.onInputChange} value={this.state.book.source_language} />;
    } else {
       return <h1 className="language source" title={this.state.book.source_language}>{this.state.book.source_language}</h1>;
    }
  },

   renderTargetLanguage: function() {
     if (this.state.isEditingBook) {
      return <input className="new isEditing" name="target_language" onChange={this.onInputChange} value={this.state.book.target_language} />;
    } else {
       return <h1 className="language target" title={this.state.book.target_language}>{this.state.book.target_language}</h1>;
    }
  },

  render: function() {
    return (
      <div className="container">
        <NavBar currentUser={this.props.currentUser} logo={this.props.logo}/>
        <span className="backgroundElement"></span>
        <div className="book">
          <div className="tools">
            <button title="Search" onClick={this.onSearchBook} className="icon">
              <img src={this.props.search} alt="Favorite"/>
            </button>
            <div className="cardinality">
              <section>
                { this.renderSourceLanguage() }
                <img src={this.props.cardinality} alt=""/>
                { this.renderTargetLanguage() }
              </section>
            </div>
            <button title="Favorite" onClick={this.onFavoriteBook} className="icon">
              <img src={this.props.unstar} alt="Favorite"/>
            </button>
            {/*<ProgressBar />*/}
          </div>
          <div className="info">
            <div className="wrapper">
              { this.renderTitle() }
              { this.renderAuthor() }
              { this.renderDescription() }
              { this.renderBookMenu() }
            </div>
          </div>
          <div className="NObannerWrapper"></div>

          <Dictionary
          isOwnedByCurrentUser={this.bookIsOwnedByCurrentUser()}
          initialPhrasePairs={this.state.phrasePairs}
          onSourcePhraseSubmit={this.onSourcePhraseSubmit}
          onTargetPhraseSubmit={this.onTargetPhraseSubmit}
          menu={this.props.menu}
          save={this.props.save}
          delete={this.props.delete}
          edit={this.props.edit}
          close={this.props.close} />
        </div>
      </div>
    )
  }
})

