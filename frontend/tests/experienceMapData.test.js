import test from "node:test";
import assert from "node:assert/strict";
import { experiences, getExperiences, getPlaceExperiences, getVisiblePlaces } from "../src/features/experienceMap/experienceMapData.js";

const newestFirst = ["ai-mmi", "qut", "uq", "gis-engineer", "gis-intern", "bachelor", "birthplace"];

test("the complete timeline follows start dates from newest to oldest", () => {
  assert.deepEqual(getExperiences().map((entry) => entry.id), newestFirst);
});

test("oldest-first starts at the birthplace without inventing a birth date", () => {
  const entries = getExperiences({ order: "oldest" });
  assert.deepEqual(entries.map((entry) => entry.id), [...newestFirst].reverse());
  assert.equal(entries[0].startDate, null);
});

test("date order survives location and category filtering", () => {
  assert.deepEqual(getPlaceExperiences("city-1").map((entry) => entry.id), ["ai-mmi"]);
  assert.deepEqual(getPlaceExperiences("qut-gardens-point").map((entry) => entry.id), ["qut"]);
  assert.deepEqual(getPlaceExperiences("uq-st-lucia").map((entry) => entry.id), ["uq"]);
  assert.deepEqual(getExperiences({ category: "education", order: "oldest" }).map((entry) => entry.id), ["bachelor", "uq", "qut"]);
  assert.deepEqual(getExperiences({ category: "work", order: "oldest" }).map((entry) => entry.id), ["gis-intern", "gis-engineer", "ai-mmi"]);
});

test("places follow the filtered timeline and are never duplicated", () => {
  assert.deepEqual(getVisiblePlaces().map((place) => place.id), ["city-1", "qut-gardens-point", "uq-st-lucia", "hangzhou", "jiashan", "dalian"]);
  assert.deepEqual(getVisiblePlaces("education", "oldest").map((place) => place.id), ["dalian", "uq-st-lucia", "qut-gardens-point"]);
  assert.deepEqual(getVisiblePlaces("origin").map((place) => place.id), ["jiashan"]);
});

test("switching order does not mutate the source records", () => {
  const original = experiences.map((entry) => ({ ...entry }));
  getExperiences({ order: "oldest" });
  getExperiences({ order: "newest" });
  assert.deepEqual(experiences, original);
});
