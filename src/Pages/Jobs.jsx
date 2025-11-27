import moment from "moment/moment";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import getPage from "../translation";

const getText = getPage("jobs"),
  apiEndpoint = process.env.REACT_APP_API_URL + "/public/api/jobs",
  filteration = {},
  jobs = [];

filteration.titles = { data: new Set() };
filteration.areas = { data: new Set() };
filteration.experience = { data: new Set() };

const nationsReq = fetch("/assets/nationalities.json").then((r) => r.json());

export default function () {
  const params = useParams(),
    [loaded, setLoaded] = useState(false),
    [err, setErr] = useState(null);

  useEffect(function () {
    if (!loaded) {
      try {
        fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        })
          .then((r) => r.json())
          .then((r) => {
            Object.assign(jobs, r.data);
            setLoaded(true);
          });
      } catch {
        setErr(getText(0));
      }
    }
  }, []);

  if (err) {
    return err;
  } else if (!loaded) return null;

  return !!params.jobId ? <JobDetails id={params.jobId} /> : <Main />;
}

function JobDetails({ id }) {
  const [nationalities, setNationalities] = useState(null),
    file = useRef(),
    popup = useRef(),
    [err, setErr] = useState(null),
    [jobDetails, setJobDetails] = useState(null);

  nationsReq.then(setNationalities);
  useEffect(function () {
    jobDetails === null &&
      fetch(process.env.REACT_APP_API_URL + "/public/api/job-details/" + id)
        .then((r) => r.json())
        .then((r) => {
          setJobDetails(r.data);
        });
  }, []);

  if (jobDetails === null) return null;

  return (
    <>
      <section
        style={{
          backgroundColor: "#f5faff",
          backgroundImage: 'url("/assets/jobs/circle.png")',
          backgroundRepeat: "no-repeat",
          color: "#848b94",
        }}
      >
        <div className="container d-flex flex-column gap-3">
          <h5
            className="align-items-center d-flex gap-2 justify-content-center m-0"
            style={{ color: "var(--primary)", fontWeight: "500" }}
          >
            <img src="/assets/jobs/case.png" alt="case" />
            <span
              className="pb-1"
              style={{ borderBottom: "2px solid currentColor" }}
            >
              {getText(1)}
            </span>
          </h5>

          <div className="align-items-center d-flex flex-wrap gap-2">
            {jobDetails.image && (
              <img
                src={process.env.REACT_APP_API_URL + jobDetails.image}
                className="col-12 col-md-2"
                style={{ objectFit: "contain", aspectRatio: "2 / 1" }}
                alt="Icon"
              />
            )}
            <div className="col-12 col-md">
              <h4 style={{ color: "var(--primary)", fontWeight: "bold" }}>
                {jobDetails.title}
              </h4>
              {/* <span
                className="px-2 py-1"
                style={{
                  color: "#fff",
                  backgroundColor: "#0ba02c",
                  fontSize: "small",
                  borderRadius: "4px",
                }}
              >
                دوام كامل
              </span> */}

              <p ref={(e) => e && (e.innerHTML = jobDetails.desc)}></p>
            </div>
          </div>
        </div>
      </section>

      <form
        className="container d-flex flex-column gap-4 my-5"
        onSubmit={formSubmit}
      >
        <h5 className="align-items-center d-flex gap-1 h5 justify-content-center m-0">
          <img src="/assets/jobs/User.png" alt="user" />
          <span
            className="pb-2"
            style={{ borderBottom: "2px solid currentColor" }}
          >
            {getText(2)}
          </span>
        </h5>

        <div className="my-4 row row-gap-2">
          <label className="col-12 col-lg-6 d-flex flex-column gap-2">
            <span>
              {getText(3)}
              <sup className="text-danger">*</sup>
            </span>
            <input
              className="form-control"
              type="text"
              name="name"
              placeholder={getText(3)}
              required={true}
            />
          </label>

          <label className="col-12 col-lg-6 d-flex flex-column gap-2">
            <span>
              {getText(31)}
              <sup className="text-danger">*</sup>
            </span>
            <input
              placeholder={getText(31)}
              className="form-control"
              style={{ textAlign: "-webkit-match-parent" }}
              type="date"
              name="birthdate"
              required={true}
            />
          </label>

          <label className="col-12 col-lg-6 d-flex flex-column gap-2">
            <span>
              {getText(32)}
              <sup className="text-danger">*</sup>
            </span>
            <select
              name="sex"
              className="form-control"
              style={{ textAlign: "-webkit-match-parent" }}
              required={true}
            >
              <option value="ذكر">{getText(33)}</option>
              <option value="أنثى">{getText(34)}</option>
            </select>
          </label>

          <label className="col-12 col-lg-6 d-flex flex-column gap-2">
            <span>
              {getText(6)}
              <sup className="text-danger">*</sup>
            </span>
            <select name="certificate" className="form-control" required={true}>
              <option value="ابتدائي">{getText(35)}</option>
              <option value="متوسط">{getText(36)}</option>
              <option value="ثانوي">{getText(37)}</option>
              <option value="بكالوريوس">{getText(38)}</option>
            </select>
          </label>

          <label className="col-12 col-lg-6 d-flex flex-column gap-2">
            <span>
              {getText(39)}
              <sup className="text-danger">*</sup>
            </span>
            <input
              type="number"
              name="nationat_id"
              placeholder={getText(39)}
              className="form-control"
              style={{ textAlign: "-webkit-match-parent" }}
              required={true}
              minLength={10}
              maxLength={10}
            />
          </label>

          <label className="col-12 col-lg-6 d-flex flex-column gap-2">
            <span>
              {getText(40)}
              <sup className="text-danger">*</sup>
            </span>
            <input
              type="date"
              name="nationat_id_ex_date"
              className="form-control"
              style={{ textAlign: "-webkit-match-parent" }}
              required={true}
            />
          </label>

          <label className="col-12 col-lg-6 d-flex flex-column gap-2">
            <span>
              {getText(4)}
              <sup className="text-danger">*</sup>
            </span>

            <div className="input-group" dir="ltr">
              <span class="input-group-text">966</span>
              <input
                type="tel"
                name="phone"
                placeholder={getText(4)}
                className="form-control"
                style={{ textAlign: "-webkit-match-parent" }}
                minLength={9}
                maxLength={9}
                required={true}
              />
            </div>
          </label>

          <label className="col-12 col-lg-6 d-flex flex-column gap-2">
            <span>
              {getText(5)}
              {/* <sup className="text-danger">*</sup> */}
            </span>
            <input
              className="form-control"
              name="email"
              type="email"
              placeholder={getText(5)}
              // required={true}
            />
          </label>

          <label className="col-12 col-lg-6 d-flex flex-column gap-2">
            <span>
              {getText(41)}
              <sup className="text-danger">*</sup>
            </span>
            <select
              name="nationality"
              defaultValue="المملكة العربية السعودية"
              className="form-control"
              required={true}
            >
              {nationalities.map((n) => {
                return (
                  <option value={n.arabicName}>
                    {n.arabicName} - {n.englishName}
                  </option>
                );
              })}
            </select>
          </label>

          <FileUpload fileRef={file} />
        </div>

        <div className="d-flex gap-3 justify-content-center">
          <input
            className="btn flex-grow-1"
            style={{
              background: "var(--primary)",
              color: "#fff",
              fontSize: "smaller",
              borderRadius: "100px",
              maxWidth: "180px",
            }}
            type="submit"
            value={getText(12)}
          />
          <Link
            to="/jobs"
            className="btn flex-grow-1"
            style={{
              background: "var(--primary)",
              color: "#fff",
              fontSize: "smaller",
              borderRadius: "100px",
              maxWidth: "180px",
            }}
          >
            {getText(13)}
          </Link>
        </div>

        <div
          ref={(e) => e && e[err ? "showPopover" : "hidePopover"]()}
          popover="auto"
          style={{
            // width: "-webkit-fill-available",
            border: "1px solid aliceblue",
            borderRadius: "4px",
            maxWidth: "740px",
          }}
        >
          <div className="align-items-center d-flex flex-column gap-4 py-3 px-4">
            <span className=" text-danger">{err}</span>
            <input
              type="submit"
              className="btn btn-outline-warning col-6"
              value={getText(14)}
            />
          </div>
        </div>
      </form>

      <div
        ref={popup}
        id="job-popover"
        popover="manual"
        style={{
          border: "1px solid aliceblue",
          borderRadius: "14px",
          color: "#aaaaaa",
          maxWidth: "740px",
          width: "100%",
        }}
      >
        <div className="align-items-center d-flex flex-column gap-2 py-3">
          <img
            src="/assets/jobs/success.png"
            alt="success"
            style={{ maxWidth: "45px" }}
          />
          <span style={{ color: "var(--primary)", fontWeight: "700" }}>
            {getText(15)}
          </span>
          {getText(16)}
          <Link
            to="/jobs"
            className="btn mt-3 px-5"
            style={{
              backgroundColor: "var(--primary)",
              color: "#fff",
              borderRadius: "100px",
              fontSize: "smaller",
            }}
          >
            {getText(17)}
          </Link>
        </div>
      </div>
    </>
  );

  function formSubmit(e) {
    e.preventDefault();
    // Handle form submission logic here
    const fd = new FormData(e.target);
    fd.append("job_id", id);
    fd.append("cv", file.current);

    fetch(process.env.REACT_APP_API_URL + "/public/api/applay-job", {
      method: "POST",
      body: fd,
    })
      .then((r) => r.json())
      .then((r) => {
        debugger;
        if (r.success === true) {
          setErr(null);
          document.getElementById("job-popover").showPopover();
        } else {
          setErr(getText(18));
        }
      })
      .catch((err) => {
        setErr(getText(18));
      });
  }
}

function FileUpload({ fileRef }) {
  const [fileData, setFileData] = useState(null);
  fileRef.current = fileData;

  return (
    <>
      <input
        id="cv-file"
        type="file"
        name="cv"
        hidden
        multiple="single"
        accept="application/pdf"
        required={true}
        ref={(e) => e && fileData === null && (e.value = "")}
        onChange={(e) => {
          const file = e.target.files[0];
          if (file && file.size > 2 * 1024 * 1024) {
            e.target.value = "";
            return window.modalOptions.open(getText(19));
          }
          setFileData(file);
        }}
      />
      {fileData ? (
        <div className="d-flex flex-column gap-2">
          <span style={{ color: "#676767", fontWeight: "700" }}>
            {getText(20)}
          </span>

          <div
            className="align-items-center box d-flex gap-2 justify-content-between px-3 py-2"
            style={{
              border: "2px solid rgb(77, 195, 89)",
              borderRadius: "6px",
              width: "fit-content",
            }}
          >
            <img
              src="/assets/jobs/Delete.png"
              alt="delete"
              onClick={() => setFileData(null)}
            />

            {fileData.name}
          </div>
        </div>
      ) : (
        <label
          htmlFor="cv-file"
          className="col-12 d-flex flex-column gap-2 mx-auto"
          // style={{ maxWidth: "600px" }}
        >
          <span>
            {getText(21)}
            <sup className="text-danger">*</sup>
          </span>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.target.style.backgroundColor = "#e6f7ef";
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.target.style.backgroundColor = "#f9fafb";
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.target.style.backgroundColor = "#f9fafb";
              const file = e.dataTransfer.files[0];
              if (file && file.type === "application/pdf") {
                if (file.size > 2 * 1024 * 1024) {
                  return window.modalOptions.open(getText(22));
                }
                setFileData(file);
              } else {
                window.modalOptions.open(getText(23));
              }
            }}
            className="align-items-center d-flex flex-column gap-2 py-3"
            style={{
              backgroundColor: "#f9fafb",
              color: "#989898",
              border: "1px dashed currentColor",
              borderStyle: "dashed",
              borderRadius: "5px",
              width: "100%",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
          >
            <img
              src="/assets/jobs/upload.png"
              style={{ maxWidth: "40px" }}
              alt="upload"
            />
            <span style={{ color: "var(--primary)", fontSize: "1.2rem" }}>
              {getText(24)}
            </span>
            {getText(25)}
          </div>
        </label>
      )}
    </>
  );
}

function Main() {
  const [search, setSearch] = useState(""),
    searchRegEx = new RegExp(search);

  filteration.titles.state = useState([]);
  filteration.areas.state = useState([]);
  filteration.experience.state = useState([]);

  return (
    <>
      {/* <section
        className="mb-5"
        style={{
          backgroundColor: "aliceblue",
          height: "163px",
          position: "relative",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="container" style={{ transform: "translateY(126%)" }}>
          <div
            className="align-items-center d-flex gap-2 p-3"
            style={{
              backgroundColor: "#fff",
              borderRadius: "4px",
              border: "1px solid aliceblue",
            }}
          >
            <img src="/assets/jobs/search.png" alt="search" />
            <input
              type="search"
              className="form-control"
              placeholder={getText(26)}
              value={search}
              onChange={({ target }) => setSearch(target.value)}
            />
            <button
              className="btn px-4 px-lg-5"
              style={{
                backgroundColor: "var(--primary)",
                color: "#fff",
                borderRadius: "38px",
                fontSize: "small",
                fontWeight: "400",
                flexGrow: 1,
                maxWidth: "162px",
              }}
            >
              {getText(27)}
            </button>
          </div>
        </div>
      </section> */}

      <section className="container">
        <h5
          className="mb-5"
          style={{ color: "var(--primary)", fontWeight: "bold" }}
        >
          {getText(28)}
        </h5>

        <div className="d-flex gap-3 flex-column-reverse flex-xl-row">
          <div style={{ flex: "1 0 55%" }}>
            <ul className="d-flex flex-wrap gap-3 list-unstyled p-0">
              {jobs.map((i) => JobItem(i, searchRegEx))}
            </ul>
          </div>

          {/* <div
            className="filter flex-grow-1"
            style={{
              color: "var(--primary)",
              accentColor: "currentColor",
              fontWeight: "600",
            }}
          >
            <Filter container={filteration.titles} title={getText(30)} />
          </div> */}
        </div>
      </section>
    </>
  );
}

function Filter({ container, title }) {
  const data = Array.from(container.data),
    [activeTitle, setActiveTitles] = container.state;

  const [expanded, setExpanded] = useState(true);

  return (
    <div className="pb-2" style={{ borderBottom: "1px solid #efefef" }}>
      <label
        className="align-items-center d-flex justify-content-between mb-2"
        style={{ fontWeight: "bold" }}
        onClick={() => setExpanded(!expanded)}
      >
        {title}
        <img
          ref={(e) =>
            e && (e.style.transform = "rotate(" + (expanded ? 0 : 180) + "deg)")
          }
          src="/assets/jobs/arrow.png"
          alt="arrow"
        />
      </label>

      <ul
        ref={(e) => {
          e && (e.style.height = (expanded ? e.scrollHeight : 0) + "px");
        }}
        style={{ transition: "0.3s" }}
        className="list-unstyled p-0 m-0 overflow-hidden"
      >
        {data.map(filterKey)}
      </ul>
    </div>
  );

  function filterKey(key) {
    const isActiveKey = activeTitle.indexOf(key) > -1;
    return (
      <li key={key} className="d-flex flex-column list-unstyled m-0 p-0">
        <label className="align-items-center d-flex gap-2">
          <input type="checkbox" onChange={toggleKey} checked={isActiveKey} />
          {key}
        </label>
      </li>
    );

    function toggleKey() {
      setActiveTitles(
        isActiveKey
          ? activeTitle.filter((k) => k !== k)
          : activeTitle.concat(key)
      );
    }
  }
}

function JobItem({ id, title, created_at, is_active }, searchStr) {
  if (!is_active || !searchStr.test(title)) return null;

  filteration.titles.data.add(title);
  // filteration.areas.add()

  const activeTitles = filteration.titles.state[0];
  if (activeTitles.length > 0 && activeTitles.indexOf(title) < 0) {
    return null;
  }

  var x = new moment();
  var y = new moment(created_at);
  var duration = moment.duration(x.diff(y)).humanize();

  return (
    <li
      key={id}
      className="p-3"
      style={{
        border: "1px solid #efefef",
        flex: "1 1 500px",
        borderRadius: "6px",
      }}
    >
      <div className="align-items-center d-flex gap-2 justify-content-between">
        <div className="d-flex flex-column gap-2">
          <h5
            className="m-0"
            style={{ color: "var(--primary)", fontWeight: "bold" }}
          >
            {title}
          </h5>
          {/* <span style={{ color: "rgb(153, 153, 153)", fontWeight: "lighter" }}>
            {"لا يشترط عدد سنين خبرة"}
          </span> */}
        </div>

        <Link
          className="btn px-4 px-lg-5"
          style={{
            color: "#fff",
            backgroundColor: "var(--primary)",
            borderRadius: "114px",
            fontSize: "smaller",
          }}
          to={"/jobs/" + id}
        >
          {getText(29)}
        </Link>
      </div>

      <hr style={{ borderColor: "inherit", opacity: "1" }} />

      <div
        className="align-items-center d-flex gap-3 justify-content-between"
        style={{ color: "#999", fontSize: "smaller" }}
      >
        <div className="align-items-center d-flex gap-2">
          <img src="/assets/jobs/location.png" alt="location" />
          <span>{"حي الصفا"}</span>
        </div>

        <span>{duration}</span>
      </div>
    </li>
  );
}

/**
   * {
  "id": 1,
  "title": "مندوب توصيل",
  "image": null,
  "desc": "",
  "date": "2025-06-12 00:00:00",
  "is_active": 1,
  "created_at": "2025-06-12 21:26:50",
  "updated_at": "2025-06-12 21:26:50"
}
 */
