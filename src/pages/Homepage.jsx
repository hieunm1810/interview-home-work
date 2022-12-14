import React, { useRef, useState } from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setArrPostsAction,
  setArrScrollAction,
  setArrSearchAction,
  setSearchValueAction,
} from "../redux/postReducer";
import moment from "moment";
import { http } from "../utils/config";
import InfiniteScroll from "react-infinite-scroll-component";
import { chunk, concat } from "lodash";

const arrTags = [
  "magenta",
  "red",
  "volcano",
  "orange",
  "gold",
  "lime",
  "green",
  "cyan",
  "blue",
  "geekblue",
  "purple",
];

const arrColors = [
  "rgba(255,0,255,0.1)",
  "rgba(136, 8, 8, 0.1)",
  "rgba(78, 39, 40,0.1)",
  "rgba(255,165,0,0.1)",
  "rgba(255,215,0,0.1)",
  "rgba(50,205,50,0.1)",
  "rgba(0,255,0,0.5)",
  "rgba(0,100,100,0.1)",
  "rgba(0,0,255,0.1)",
  "rgba(63,85,109,0.1)",
  "rgba(230,230,250,0.1)",
];

export default function Homepage() {
  const { arrPosts, arrSearch, searchValue, arrScroll } = useSelector(
    (state) => state.postReducer
  );

  const [hasMore, setHasMore] = useState(false);
  const indexRef = useRef(1);
  const arrScrollChunkRef = useRef([]);

  const dispatch = useDispatch();

  const combineUserAndPost = async () => {
    const posts = await http.get("/posts");
    const users = await http.get("/users");
    const comments = await http.get("/comments");
    const arrPostUpdated = posts.data.map((post) => {
      const findedUser = users.data.find((user) => post.userId === user.id);
      const findedComment = comments.data.filter(
        (comment) => comment.postId === post.id
      );
      return { ...post, name: findedUser.name, comments: findedComment };
    });
    console.log(arrPostUpdated);
    arrScrollChunkRef.current = chunk(arrPostUpdated, 6);
    console.log(arrScrollChunkRef.current);
    const actionScroll = setArrScrollAction(arrScrollChunkRef.current[0]);
    const actionPost = setArrPostsAction(arrPostUpdated);
    dispatch(actionPost);
    dispatch(actionScroll);
  };
  const randomDate = (start, end) => {
    return new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
  };
  const searchPost = (keyword) => {
    const regex = new RegExp(keyword, "g");
    const arrSearchUpdate = arrPosts.filter((post) => regex.test(post.title));
    console.log(arrSearchUpdate);
    arrScrollChunkRef.current = chunk(arrSearchUpdate, 6);
    console.log(arrScrollChunkRef.current);
    if (arrScrollChunkRef.current.length !== 0) {
      const actionScroll = setArrScrollAction(arrScrollChunkRef.current[0]);
      dispatch(actionScroll);
    } else {
      const actionScroll = setArrScrollAction([]);
      dispatch(actionScroll);
    }
    const action = setArrSearchAction(arrSearchUpdate);
    dispatch(action);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchPost(searchValue);
  };

  const handleChange = (e) => {
    setHasMore(true);
    indexRef.current = 1;
    const { id, value } = e.target;
    console.log(value);
    const action = setSearchValueAction(value);
    dispatch(action);
    searchPost(value);
  };

  const fetchData = () => {
    console.log("abc");
    if (indexRef.current < arrScrollChunkRef.current.length) {
      setTimeout(() => {
        console.log(
          concat(arrScroll, arrScrollChunkRef.current[indexRef.current])
        );
        const actionScroll = setArrScrollAction(
          concat(arrScroll, arrScrollChunkRef.current[indexRef.current])
        );
        dispatch(actionScroll);
        indexRef.current++;
      }, 1500);
    } else {
      setHasMore(false);
      return;
    }
  };
  useEffect(() => {
    if (searchValue === "") {
      indexRef.current = 1;
      combineUserAndPost();
    }
    if (indexRef.current >= arrScrollChunkRef.current.length) {
      setHasMore(false);
    }
  }, [searchValue]);

  useEffect(() => {
    setHasMore(true);
    combineUserAndPost();
  }, []);
  return (
    <div>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Input post's title"
              aria-label="Recipient's username"
              aria-describedby="button-addon2"
              onChange={handleChange}
              value={searchValue}
            />
            <button className="btn btn-outline-secondary" id="button-addon2">
              Button
            </button>
          </div>
        </form>
        <InfiniteScroll
          dataLength={arrScroll.length}
          next={fetchData}
          hasMore={hasMore}
          loader={<h4 className="fw-bold text-center">Loading...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          {arrScroll?.map((post, index) => {
            return (
              <div key={index} className="mb-5">
                <h1 className="text-center fw-bold">{post.title}</h1>
                <div className="d-flex justify-content-between">
                  <div>
                    <p className="mb-0 fw-semibold">Author: {post.name}</p>
                    <p className="fw-semibold">
                      Created at:{" "}
                      {moment(
                        randomDate(new Date(2012, 0, 1), new Date())
                      ).format("ll")}
                    </p>
                  </div>
                  <div style={{ width: "300px" }}>
                    {arrTags.map((e, index) => {
                      return (
                        <button
                          key={index}
                          className="me-2 mb-2"
                          style={{
                            color: e,
                            borderColor: e,
                            borderWidth: "1px",
                            backgroundColor: arrColors[index],
                            borderRadius: "5px",
                            fontSize: "12px",
                          }}
                        >
                          {e}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <p>{post.body}</p>
                <div className="border-bottom pb-2">
                  <a
                    className="text-decoration-none fw-semibold"
                    style={{ color: "#6a6a6a" }}
                    data-bs-toggle="collapse"
                    href={`#collapse${index}`}
                    aria-expanded="false"
                    aria-controls={`collapse${index}`}
                  >
                    {post.comments.length} replies
                  </a>
                </div>
                <div className="collapse" id={`collapse${index}`}>
                  {post.comments.map((comment, key) => {
                    return (
                      <div
                        className="card card-body d-flex flex-row gap-2 border-0"
                        key={key}
                      >
                        <div>
                          <img
                            src={`https://i.pravatar.cc/50?img=${index + key}`}
                            width={50}
                            height={50}
                            alt=""
                          />
                        </div>
                        <div>
                          <p
                            className="lh-1 d-flex gap-2 fw-semibold"
                            style={{ color: "#9b9b9b" }}
                          >
                            {comment.email}{" "}
                            <span style={{ color: "#eaeaea" }}>
                              {moment(
                                randomDate(new Date(2022, 8, 12), new Date())
                              )
                                .startOf("day")
                                .fromNow()}
                            </span>
                          </p>
                          <p style={{ color: "#6c6c6c" }}>{comment.body}</p>
                          <p style={{ color: "#9b9b9b" }}>Reply to</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </InfiniteScroll>
        {/* {searchValue !== ""
          ? arrSearch?.map((post, index) => {
              return (
                <div key={index} className="mb-5">
                  <h1 className="text-center fw-bold">{post.title}</h1>
                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="mb-0 fw-semibold">Author: {post.name}</p>
                      <p className="fw-semibold">
                        Created at:{" "}
                        {moment(
                          randomDate(new Date(2012, 0, 1), new Date())
                        ).format("ll")}
                      </p>
                    </div>
                    <div style={{ width: "300px" }}>
                      {arrTags.map((e, index) => {
                        return (
                          <button
                            key={index}
                            className="me-2 mb-2"
                            style={{
                              color: e,
                              borderColor: e,
                              borderWidth: "1px",
                              backgroundColor: arrColors[index],
                              borderRadius: "5px",
                              fontSize: "12px",
                            }}
                          >
                            {e}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <p>{post.body}</p>
                  <div className="border-bottom pb-2">
                    <a
                      className="text-decoration-none fw-semibold"
                      style={{ color: "#6a6a6a" }}
                      data-bs-toggle="collapse"
                      href={`#collapse${index}`}
                      aria-expanded="false"
                      aria-controls={`collapse${index}`}
                    >
                      {post.comments.length} replies
                    </a>
                  </div>
                  <div className="collapse" id={`collapse${index}`}>
                    {post.comments.map((comment, key) => {
                      return (
                        <div
                          className="card card-body d-flex flex-row gap-2 border-0"
                          key={key}
                        >
                          <div>
                            <img
                              src={`https://i.pravatar.cc/50?img=${
                                index + key
                              }`}
                              width={50}
                              height={50}
                              alt=""
                            />
                          </div>
                          <div>
                            <p
                              className="lh-1 d-flex gap-2 fw-semibold"
                              style={{ color: "#9b9b9b" }}
                            >
                              {comment.email}{" "}
                              <span style={{ color: "#eaeaea" }}>
                                {moment(
                                  randomDate(new Date(2022, 8, 12), new Date())
                                )
                                  .startOf("day")
                                  .fromNow()}
                              </span>
                            </p>
                            <p style={{ color: "#6c6c6c" }}>{comment.body}</p>
                            <p style={{ color: "#9b9b9b" }}>Reply to</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          : arrPosts?.map((post, index) => {
              return (
                <div key={index} className="mb-5">
                  <h1 className="text-center fw-bold">{post.title}</h1>
                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="mb-0 fw-semibold">Author: {post.name}</p>
                      <p className="fw-semibold">
                        Created at:{" "}
                        {moment(
                          randomDate(new Date(2012, 0, 1), new Date())
                        ).format("ll")}
                      </p>
                    </div>
                    <div style={{ width: "300px" }}>
                      {arrTags.map((e, index) => {
                        return (
                          <button
                            key={index}
                            className="me-2 mb-2"
                            style={{
                              color: e,
                              borderColor: e,
                              borderWidth: "1px",
                              backgroundColor: arrColors[index],
                              borderRadius: "5px",
                              fontSize: "12px",
                            }}
                          >
                            {e}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <p>{post.body}</p>
                  <div className="border-bottom pb-2">
                    <a
                      className="text-decoration-none fw-semibold"
                      style={{ color: "#6a6a6a" }}
                      data-bs-toggle="collapse"
                      href={`#collapse${index}`}
                      aria-expanded="false"
                      aria-controls={`collapse${index}`}
                    >
                      {post.comments.length} replies
                    </a>
                  </div>
                  <div className="collapse" id={`collapse${index}`}>
                    {post.comments.map((comment, key) => {
                      return (
                        <div
                          className="card card-body d-flex flex-row gap-2 border-0"
                          key={key}
                        >
                          <div>
                            <img
                              src={`https://i.pravatar.cc/50?img=${
                                index + key
                              }`}
                              width={50}
                              height={50}
                              alt=""
                            />
                          </div>
                          <div>
                            <p
                              className="lh-1 d-flex gap-2 fw-semibold"
                              style={{ color: "#9b9b9b" }}
                            >
                              {comment.email}{" "}
                              <span style={{ color: "#eaeaea" }}>
                                {moment(
                                  randomDate(new Date(2022, 8, 12), new Date())
                                )
                                  .startOf("day")
                                  .fromNow()}
                              </span>
                            </p>
                            <p style={{ color: "#6c6c6c" }}>{comment.body}</p>
                            <p style={{ color: "#9b9b9b" }}>Reply to</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })} */}
      </div>
    </div>
  );
}
