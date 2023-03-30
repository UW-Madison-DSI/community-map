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
			array_push($userData, [
				'firstName' => $user->firstName,
				'lastName' => $user->lastName,
				'emailAddress' => $userAccount->email
			]);
		}

		// sort user data by last name ascending
		//
		usort($userData, function($a, $b) {
    		return $a['lastName'] > $b['lastName'] ? 1 : -1;
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

				$columns = ['First name', 'Last name', 'Email address', 'Contact label'];
				$callback = function() use($userData, $columns) {
					$file = fopen('php://output', 'w');
					fputcsv($file, $columns);

					foreach ($userData as $user) {
						$row['First name'] = $user['firstName'];
						$row['Last name'] = $user['lastName'];
						$row['Email address'] = $user['emailAddress'];
						$row['Contact label'] = 'Data Science Hub';

						fputcsv($file, array($row['First name'], $row['Last name'], $row['Email address'], $row['Contact label']));
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