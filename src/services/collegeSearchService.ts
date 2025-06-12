
interface University {
  name: string;
  country: string;
  alpha_two_code: string;
  web_pages: string[];
  domains: string[];
  state_province?: string;
}

interface CollegeSearchResult {
  id: string;
  name: string;
  location: string;
  country: string;
  state: string;
  website: string;
  type: 'university' | 'college';
}

export class CollegeSearchService {
  private baseUrl = 'http://universities.hipolabs.com';
  private serpApiKey = '68266d2fd6105d95d3668bf4c4284db3bccea5b9d575b905960d42669e9e67eb';

  async searchColleges(query: string, country?: string): Promise<CollegeSearchResult[]> {
    try {
      let url = `${this.baseUrl}/search?name=${encodeURIComponent(query)}`;
      if (country) {
        url += `&country=${encodeURIComponent(country)}`;
      }

      const response = await fetch(url);
      const universities: University[] = await response.json();

      // Filter for US, UK, and Singapore universities
      const targetCountries = ['United States', 'United Kingdom', 'Singapore'];
      const filteredUniversities = universities.filter(uni => 
        targetCountries.includes(uni.country)
      );

      return filteredUniversities.map((uni, index) => ({
        id: `${uni.alpha_two_code}-${index}`,
        name: uni.name,
        location: uni.state_province || uni.country,
        country: uni.country,
        state: uni.state_province || '',
        website: uni.web_pages[0] || '',
        type: uni.name.toLowerCase().includes('college') ? 'college' : 'university'
      }));
    } catch (error) {
      console.error('Error searching colleges:', error);
      return [];
    }
  }

  async getCollegesByCountry(country: 'US' | 'UK' | 'Singapore'): Promise<CollegeSearchResult[]> {
    const countryNames = {
      'US': 'United States',
      'UK': 'United Kingdom',
      'Singapore': 'Singapore'
    };

    return this.searchColleges('', countryNames[country]);
  }

  async getTopColleges(): Promise<CollegeSearchResult[]> {
    const topCollegeNames = [
      'Harvard University',
      'Stanford University',
      'Massachusetts Institute of Technology',
      'University of Cambridge',
      'University of Oxford',
      'National University of Singapore'
    ];

    const results: CollegeSearchResult[] = [];
    
    for (const collegeName of topCollegeNames) {
      const colleges = await this.searchColleges(collegeName);
      if (colleges.length > 0) {
        results.push(colleges[0]);
      }
    }

    return results;
  }

  async getCollegeDetails(collegeName: string): Promise<any> {
    try {
      const serpUrl = `https://serpapi.com/search.json?q=${encodeURIComponent(collegeName + ' university admission requirements')}&api_key=${this.serpApiKey}`;
      
      const response = await fetch(serpUrl);
      const data = await response.json();
      
      return {
        name: collegeName,
        details: data.organic_results?.slice(0, 3) || [],
        admissionInfo: data.answer_box || null
      };
    } catch (error) {
      console.error('Error fetching college details:', error);
      return null;
    }
  }
}

export const collegeSearchService = new CollegeSearchService();
