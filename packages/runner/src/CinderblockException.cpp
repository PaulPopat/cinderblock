#include "CinderblockException.h"
#include <iostream>

CinderblockException::CinderblockException(const char* msg)
  : msg(msg)
{
  std::cout << msg;
}

std::string CinderblockException::get_message() const
{
  return std::string(this->msg);
}

const char* CinderblockException::what() const noexcept
{
  return this->msg;
}
