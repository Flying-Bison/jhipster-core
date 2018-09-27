/**
 * Copyright 2013-2018 the original author or authors from the JHipster project.
 *
 * This file is part of the JHipster project, see http://www.jhipster.tech/
 * for more information.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable no-new, no-unused-expressions */
const expect = require('chai').expect;
const { JDLLexer } = require('../../../lib/dsl/lexer');

describe('JDLLexer', () => {
  context('when passing a valid JDL input', () => {
    let lexingResult = null;

    before(() => {
      const input = `
   entity JobHistory {
     startDate ZonedDateTime,
     endDate ZonedDateTime,
     language Language
   }`;
      lexingResult = JDLLexer.tokenize(input);
    });

    it('does not fail', () => {
      expect(lexingResult.errors).to.be.empty;
    });

    it('can lex a simple valid JDL text', () => {
      const tokens = lexingResult.tokens;
      expect(tokens.length).to.equal(12);
      expect(tokens[0].image).to.equal('entity');
      expect(tokens[1].image).to.equal('JobHistory');
      expect(tokens[2].image).to.equal('{');
      expect(tokens[3].image).to.equal('startDate');
      expect(tokens[4].image).to.equal('ZonedDateTime');
      expect(tokens[5].image).to.equal(',');
      expect(tokens[6].image).to.equal('endDate');
      expect(tokens[7].image).to.equal('ZonedDateTime');
      expect(tokens[8].image).to.equal(',');
      expect(tokens[9].image).to.equal('language');
      expect(tokens[10].image).to.equal('Language');
      expect(tokens[11].image).to.equal('}');
    });
  });

  context('when passing an invalid JDL input', () => {
    let lexingResult = null;

    before(() => {
      const input = `
   entity JobHistory {
     startDate ZonedDateTime,
     ###
     endDate ZonedDateTime
   }`;
      lexingResult = JDLLexer.tokenize(input);
    });

    it('reports the errors', () => {
      const errors = lexingResult.errors;
      expect(errors).to.have.lengthOf(1);
      expect(errors[0].line).to.equal(4);
      expect(errors[0].column).to.equal(6);
      expect(errors[0].message).to.include('#');
      expect(errors[0].message).to.include('skipped 3 characters');
    });

    it('can lex a simple invalid JDL text', () => {
      expect(lexingResult.tokens).to.have.lengthOf(
        9,
        'All 9 tokens should have been lexed even though "@@@" caused a syntax error'
      );
    });
  });

  context('when passing a JDL with acceptableValues defined for fields', () => {
    let lexingResult = null;

    before(() => {
      const input = `
   entity JobHistory {
     names String acceptableValues(["Person", "First Last"]),
     decimalNumbers Double acceptableValues([-0.02, 0.05, 1.5]) required,
     integerNumbers Integer acceptableValues([-1,2,42]),
   }`;
      lexingResult = JDLLexer.tokenize(input);
    });

    it('does not fail', () => {
      expect(lexingResult.errors).to.be.empty;
    });

    it('acceptableValues', () => {
      const tokens = lexingResult.tokens;
      // entity
      expect(tokens.length).to.equal(42);
      expect(tokens[0].image).to.equal('entity');
      expect(tokens[1].image).to.equal('JobHistory');
      expect(tokens[2].image).to.equal('{');
      // names field
      expect(tokens[3].image).to.equal('names');
      expect(tokens[4].image).to.equal('String');
      expect(tokens[5].image).to.equal('acceptableValues');
      expect(tokens[6].image).to.equal('(');
      expect(tokens[7].image).to.equal('[');
      expect(tokens[8].image).to.equal('"Person"');
      expect(tokens[9].image).to.equal(',');
      expect(tokens[10].image).to.equal('"First Last"');
      expect(tokens[11].image).to.equal(']');
      expect(tokens[12].image).to.equal(')');
      expect(tokens[13].image).to.equal(',');
      // doubleNumbers field
      expect(tokens[14].image).to.equal('decimalNumbers');
      expect(tokens[15].image).to.equal('Double');
      expect(tokens[16].image).to.equal('acceptableValues');
      expect(tokens[17].image).to.equal('(');
      expect(tokens[18].image).to.equal('[');
      expect(tokens[19].image).to.equal('-0.02');
      expect(tokens[20].image).to.equal(',');
      expect(tokens[21].image).to.equal('0.05');
      expect(tokens[22].image).to.equal(',');
      expect(tokens[23].image).to.equal('1.5');
      expect(tokens[24].image).to.equal(']');
      expect(tokens[25].image).to.equal(')');
      expect(tokens[26].image).to.equal('required');
      expect(tokens[27].image).to.equal(',');
      // integerNumbers field
      expect(tokens[28].image).to.equal('integerNumbers');
      expect(tokens[29].image).to.equal('Integer');
      expect(tokens[30].image).to.equal('acceptableValues');
      expect(tokens[31].image).to.equal('(');
      expect(tokens[32].image).to.equal('[');
      expect(tokens[33].image).to.equal('-1');
      expect(tokens[34].image).to.equal(',');
      expect(tokens[35].image).to.equal('2');
      expect(tokens[36].image).to.equal(',');
      expect(tokens[37].image).to.equal('42');
      expect(tokens[38].image).to.equal(']');
      expect(tokens[39].image).to.equal(')');
      expect(tokens[40].image).to.equal(',');
      // close
      expect(tokens[41].image).to.equal('}');
    });
  });
});
