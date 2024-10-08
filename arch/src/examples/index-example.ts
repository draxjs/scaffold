import {ArchGenerator} from '@drax/arch';
import PersonSchema from './schemas-examples/PersonSchema';
import CountrySchema from './schemas-examples/CountrySchema';
import LanguageSchema from './schemas-examples/LanguageSchema';

const schemas = [PersonSchema, CountrySchema, LanguageSchema];

const generator = new ArchGenerator(schemas);
generator.build()
