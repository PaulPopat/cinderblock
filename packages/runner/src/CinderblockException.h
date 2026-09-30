#pragma once

#include <exception>
#include <string>

class CinderblockException : std::exception {
  public:
  CinderblockException(const char* msg);

  std::string get_message() const;
  const char* what() const noexcept;

  private:
  const char* msg;
};
