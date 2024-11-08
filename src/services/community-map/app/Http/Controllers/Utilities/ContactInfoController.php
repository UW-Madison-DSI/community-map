<?php

namespace App\Http\Controllers\Utilities;

use Illuminate\Http\Request;
use App\Models\Users\User;
use App\Models\UserAccounts\UserAccount;
use App\Http\Controllers\Controller;

class ContactInfoController extends Controller
{
	/**
	 * Get CSV of people who would like to receive the newsletter.
	 *
	 * @param Illuminate\Http\Request $request - the Http request object
	 * @return object
	 */
	public function getContactInfo(Request $request) {
		$str = '';

		// get parameters
		//
		$password = $request->input('password');
		$isAffiliate = boolval($request->input('affiliate'));
		$option = $request->input('option', null);
		$format = $request->input('format', 'json');

		// check password
		//
		if ($password != env('APP_ADMIN_PASSWORD')) {
			return response("Unauthorized access. Please provide a valid password.", 401);
		}

		// get user accounts
		//
		$userAccounts = UserAccount::all();

		// filter user accounts
		//
		if ($option || $isAffiliate) {
			$userAccounts = $userAccounts->filter(function ($userAccount) use ($option, $isAffiliate) {
				$found = true;

				// apply filters
				//
				if ($option && !$userAccount->hasOption($option)) {
					$found = false;
				}
				if ($isAffiliate && !$userAccount->isAffiliate() == $isAffiliate) {
					$found = false;
				}

				return $found;
			})->values();
		}

		// collect user data
		//
		$userData = [];
		foreach ($userAccounts as $userAccount) {
			$user = User::find($userAccount->id);

			if ($user) {
				array_push($userData, [

					// contact info
					//
					'first_name' => $user->first_name,
					'last_name' => $user->last_name,
					'username' => $userAccount->username,
					'email_address' => $userAccount->email,
					'communities' => $user->communities,

					// research info
					//
					'research_summary' => $user? $user->research_summary : null,
					'research_terms' => $user? $user->research_terms : null,
					'research_interests' => $user? $user->research_interests : null,

					// academic info
					//
					'degree_institution' => $user? $user->degree_institution : null,
					'degree_year' => $user? $user->degree_year : null,
					'orcid_id' => $user? $user->orcid_id : null,

					// personal info
					//
					'homepage' => $user? $user->homepage : null,
					'social_url' => $user? $user->social_url : null,
					'github_url' => $user? $user->github_url : null
				]);
			}
		}

		// sort user data by last name ascending
		//
		usort($userData, function($a, $b) {
    		return $a['last_name'] > $b['last_name'] ? 1 : -1;
		});

		// format data as a CSV
		//
		switch ($format) {

			// create csv file
			//
			case 'csv':
				$fileName = $option? $option . '.csv' : 'contact-info.csv';

				$headers = array(
					"Content-type"        => "text/csv",
					"Content-Disposition" => "attachment; filename=$fileName",
					"Pragma"              => "no-cache",
					"Cache-Control"       => "must-revalidate, post-check=0, pre-check=0",
					"Expires"             => "0"
				);

				$columns = [

					// contact info
					//
					'First name',
					'Last name',
					'Username',
					'Email address',
					'Communities',

					// research info
					//
					'Research summary',
					'Research terms',
					'Research interests',

					// academic info
					//
					'Degree institution',
					'Degree year',
					'Orchid id',

					// web info
					//
					'Homepage',
					'Social url',
					'GitHub url',

					// label
					//
					'Contact label'];

				$callback = function() use($userData, $columns) {
					$file = fopen('php://output', 'w');
					fputcsv($file, $columns);

					foreach ($userData as $user) {

						// contact info
						//
						$row['First name'] = $user['first_name'];
						$row['Last name'] = $user['last_name'];
						$row['Username'] = $user['username'];
						$row['Email address'] = $user['email_address'];
						$row['Communities'] = $user['communities']? implode(', ', $user['communities']) : '';

						// research info
						//
						$row['Research summary'] = $user['research_summary'];
						$row['Research interests'] = $user['research_interests'];

						// academic info
						//
						$row['Degree institution'] = $user['degree_institution'];
						$row['Degree year'] = $user['degree_year'];
						$row['Orcid ID'] = $user['orcid_id'];

						// web info
						//
						$row['Homepage'] = $user['homepage'];
						$row['Social url'] = $user['social_url'];
						$row['GitHub url'] = $user['github_url'];

						// label
						//
						$row['Contact label'] = 'Data Science Hub';

						fputcsv($file, array(

							// contact info
							//
							$row['First name'],
							$row['Last name'],
							$row['Username'],
							$row['Email address'],
							$row['Communities'],

							// research info
							//
							$row['Research summary'],
							$row['Research interests']? implode(', ', $row['Research interests']) : '',

							// academic info
							//
							$row['Degree institution'],
							$row['Degree year'],
							$row['Orcid ID'],

							// personal info
							//
							$row['Homepage'],
							$row['Social url'],
							$row['GitHub url'],

							// label
							//
							$row['Contact label']));
					}

					fclose($file);
				};

				$response = response()->stream($callback, 200, $headers);
				break;

			// create JSON object array
			//
			case 'json':
			default:
				$response = $userData;
				break;
		}

		return $response;
	}
}