/**
 * Created by hqyone on 9/22/16.
 */
var TestComponent = React.createClass({
    render: function() {
        return (
            <div className= "testComponent">
                Hello, world! I am a CommentBox.
            </div>
        );
    }
});


// tutorial2.js
var CommentList = React.createClass({
    render: function() {
        return (
            <div className="commentList">
                Hello, world! I am a CommentList.
            </div>
        );
    }
});

var CommentForm = React.createClass({
    render: function() {
        return (
            <div className="commentForm">
                Hello, world! I am a CommentForm.
            </div>
        );
    }
});
