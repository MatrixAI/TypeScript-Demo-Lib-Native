#define NAPI_VERSION 3

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <node_api.h>
#include <napi-macros.h>

/**
 * Raw n-api usage
 * The napi_env is a context references VM-specific state
 * It must be passed into all subsequent nested n-api calls
 * The napi_callback_info contains information on how this function is called
 */
napi_value addOne (napi_env env, napi_callback_info info) {
  napi_status status;

  // Get parameters
  napi_value argv[1];
  size_t argc = 1;
  status = napi_get_cb_info(env, info, &argc, argv, NULL, NULL);
  if (status != napi_ok) {
    // Throws JS Error
    napi_throw_error(
      env,
      NULL,
      "napi_get_cb_info(env, info, &argc, argv, NULL, NULL) failed!"
    );
    return NULL;
  }

  // Get int32_t from JS number (JS numbers are naturally doubles)
  int32_t number;
  status = napi_get_value_int32(env, argv[0], &number);
  if (status != napi_ok) {
    // Throws JS Error with `"EINVAL"` as the code property
    napi_throw_error(
      env,
      "EINVAL",
      "Expected number"
    );
    return NULL;
  }

  // Add 1
  number += 1;

  // Convert int32_t to JS number
  napi_value return_int32;
  status = napi_create_int32(env, number, &return_int32);
  if (status != napi_ok)  {
    napi_throw_error(
      env,
      NULL,
      "napi_create_int32(env, number, &return_int32) failed!"
    );
    return NULL;
  }

  // Return JS number
  return return_int32;
}

/**
 * Using n-api macros instead removes alot of boilerplate
 * This function is basically the same as `addOne`
 */
NAPI_METHOD(timesTwo) {
  NAPI_ARGV(1)
  NAPI_ARGV_INT32(number, 0)
  number *= 2;
  NAPI_RETURN_INT32(number)
}

/**
 * Create an array of [0.5]
 */
NAPI_METHOD(createArr) {
  // Create arr with length of 1
  napi_value arr;
  NAPI_STATUS_THROWS(napi_create_array_with_length(env, 1, &arr))
  // Set the value on the arr
  napi_value value;
  NAPI_STATUS_THROWS(napi_create_double(env, 0.5, &value));
  NAPI_STATUS_THROWS(napi_set_element(env, arr, 0, value))
  return arr;
}

/**
 * Creates an object of { key: 'hello world' }
 */
NAPI_METHOD(createObj) {
  napi_value obj;
  NAPI_STATUS_THROWS(napi_create_object(env, &obj))
  // Set a value on the obj
  napi_value value;
  NAPI_STATUS_THROWS(napi_create_string_utf8(
    env,
    "hello world",
    NAPI_AUTO_LENGTH,
    &value
  ));
  NAPI_STATUS_THROWS(napi_set_named_property(env, obj, "key", value));
  return obj;
}

/**
 * Takes an object and sets a property on it
 * Object must be { key1: "some string" }
 * Will return object new property key2
 */
NAPI_METHOD(setProperty) {
  NAPI_ARGV(1)
  // Expect an object argument
  napi_value obj = argv[0];
  // Extract property key1, and expect it to be a string
  napi_value keyValue;
  NAPI_STATUS_THROWS(napi_get_named_property(env, obj, "key1", &keyValue))
  // Parameterised length requires malloc for C90 compliance
  // Normally we could use VLA, but MSVC doesn't support it
  // This macro produces keyValueString_len and keyValueString_size
  // Both will result in the same number, they will be the length of the JS string
  // which does not include the null byte
  // Therefore 'value1' is length of 6, then both will be 6
  // Ideally the `keyValueString_size` should be 7, and `keyValueString_len` should be 6
  // But that is nto the case here
  NAPI_UTF8_MALLOC(keyValueString, keyValue)
  // In jest, if testing against a single file with --verbose=true, these logs may not show
  // Force it with --verbose=false
  fprintf(stderr, "keyValueString_size: %zu\n", keyValueString_size);
  fprintf(stderr, "keyValueString_len: %zu\n", keyValueString_len);
  // Concatenate the string
  char * fullString = calloc(8 + keyValueString_len + 1, sizeof(char));
  strcat(fullString, "initial ");
  strcat(fullString, keyValueString);
  // Convert the C string back to JS string
  napi_value fullStringJS;
  NAPI_STATUS_THROWS(napi_create_string_utf8(
    env,
    fullString,
    NAPI_AUTO_LENGTH,
    &fullStringJS
  ))
  // Set the the new string as new of property key2
  NAPI_STATUS_THROWS(napi_set_named_property(env, obj, "key2", fullStringJS));
  // Free malloced data
  free(fullString);
  free(keyValueString);
  return obj;
}

/**
 * All exported functions
 */
NAPI_INIT() {
  // Raw n-api way of exporting a function
  napi_status status;
  napi_value addOne_fn;
  status = napi_create_function(env, NULL, 0, addOne, NULL, &addOne_fn);
  if (status != napi_ok) {
    napi_throw_error(
      env,
      NULL,
      "napi_create_function(env, NULL, 0, addOne, NULL, &addOne_fn) failed!"
    );
    return;
  }
  status = napi_set_named_property(env, exports, "addOne", addOne_fn);
  if (status != napi_ok) {
    napi_throw_error(
      env,
      NULL,
      "napi_set_named_property(env, exports, \"addOne\", addOne_fn) failed!"
    );
    return;
  }

  // Using the n-api macros
  NAPI_EXPORT_FUNCTION(timesTwo)
  NAPI_EXPORT_FUNCTION(createArr)
  NAPI_EXPORT_FUNCTION(createObj)
  NAPI_EXPORT_FUNCTION(setProperty)
}
